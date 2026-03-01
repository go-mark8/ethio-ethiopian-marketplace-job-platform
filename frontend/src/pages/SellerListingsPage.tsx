import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerProducts, useGetSellerProducts, useDeleteProduct, useCreateProduct } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Store, Edit, Trash2, Plus, LogIn, Search, Mail, Phone, MapPin, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';
import { ProductCategory } from '../types';
import { ExternalBlob } from '../backend';

interface SellerListingsPageProps {
  onViewProduct: (productId: string) => void;
}

export default function SellerListingsPage({ onViewProduct }: SellerListingsPageProps) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const [viewMode, setViewMode] = useState<'own' | 'search'>('own');
  const [searchPrincipal, setSearchPrincipal] = useState('');
  const [searchedPrincipal, setSearchedPrincipal] = useState<Principal | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: ownProducts, isLoading: ownLoading } = useGetCallerProducts();
  const { data: sellerProducts, isLoading: sellerLoading } = useGetSellerProducts(searchedPrincipal);
  const deleteProduct = useDeleteProduct();
  const createProduct = useCreateProduct();

  const isAuthenticated = !!identity;

  const handleSearch = () => {
    try {
      const principal = Principal.fromText(searchPrincipal.trim());
      setSearchedPrincipal(principal);
      setViewMode('search');
    } catch (error) {
      toast.error('Invalid principal ID');
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await deleteProduct.mutateAsync(productId);
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
      console.error(error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container px-4 py-12">
        <Card className="max-w-md mx-auto text-center border-2 border-dashed">
          <CardContent className="pt-12 pb-8 space-y-4">
            <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-ethiopian-green/20 to-ethiopian-yellow/20 flex items-center justify-center">
              <Store className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Start Selling</h2>
            <p className="text-muted-foreground">
              Login to manage your products and view other sellers
            </p>
            <Button
              onClick={login}
              disabled={loginStatus === 'logging-in'}
              className="gap-2 mt-4"
              size="lg"
            >
              <LogIn className="h-4 w-4" />
              {loginStatus === 'logging-in' ? 'Logging in...' : 'Login to Continue'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container px-4 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-ethiopian-green to-ethiopian-yellow flex items-center justify-center">
            <Store className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Seller Hub</h1>
            <p className="text-muted-foreground">Manage your listings and explore sellers</p>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'own' ? 'default' : 'outline'}
            onClick={() => setViewMode('own')}
            className="flex-1"
          >
            My Products
          </Button>
          <Button
            variant={viewMode === 'search' ? 'default' : 'outline'}
            onClick={() => setViewMode('search')}
            className="flex-1"
          >
            Find Sellers
          </Button>
        </div>

        {/* Search Seller */}
        {viewMode === 'search' && (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter seller principal ID..."
                value={searchPrincipal}
                onChange={(e) => setSearchPrincipal(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        )}
      </div>

      {/* Own Products View */}
      {viewMode === 'own' && (
        <>
          {/* Add Product Button */}
          <Card 
            className="border-2 border-dashed hover:border-primary/50 transition-colors cursor-pointer group"
            onClick={() => setShowCreateModal(true)}
          >
            <CardContent className="py-8 text-center">
              <Plus className="h-12 w-12 mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
              <h3 className="font-bold text-lg mb-1">Add New Product</h3>
              <p className="text-sm text-muted-foreground">
                List a new item for sale
              </p>
            </CardContent>
          </Card>

          {/* Products List */}
          {ownLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-40" />
              ))}
            </div>
          ) : !ownProducts || ownProducts.length === 0 ? (
            <Card className="border-2 border-dashed">
              <CardContent className="py-12 text-center">
                <Store className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-bold mb-2">No products yet</h3>
                <p className="text-muted-foreground">
                  Start selling by adding your first product
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {ownProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow border-2 cursor-pointer"
                  onClick={() => onViewProduct(product.id)}
                >
                  <div className="flex gap-4">
                    {product.images.length > 0 ? (
                      <img
                        src={product.images[0].getDirectURL()}
                        alt={product.title}
                        className="h-32 w-32 object-cover"
                      />
                    ) : (
                      <div className="h-32 w-32 bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground text-xs">No image</span>
                      </div>
                    )}
                    <CardContent className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-lg">{product.title}</h3>
                          <Badge variant="secondary" className="capitalize">
                            {product.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary">
                          {Number(product.price)} ETB
                        </span>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.info('Edit functionality coming soon');
                            }}
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(product.id);
                            }}
                            disabled={deleteProduct.isPending}
                            className="gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Seller Search View */}
      {viewMode === 'search' && searchedPrincipal && (
        <>
          {/* Seller Info Card */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl font-bold">
                  S
                </div>
                <div>
                  <div className="text-lg">Seller Storefront</div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {searchedPrincipal.toString().slice(0, 20)}...
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Contact via messaging</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Ethiopia</span>
              </div>
            </CardContent>
          </Card>

          {/* Seller Products */}
          {sellerLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-40" />
              ))}
            </div>
          ) : !sellerProducts || sellerProducts.length === 0 ? (
            <Card className="border-2 border-dashed">
              <CardContent className="py-12 text-center">
                <Store className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-muted-foreground">
                  This seller hasn't listed any products yet
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-bold">
                Products ({sellerProducts.length})
              </h3>
              {sellerProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => onViewProduct(product.id)}
                >
                  <div className="flex gap-4">
                    {product.images.length > 0 ? (
                      <img
                        src={product.images[0].getDirectURL()}
                        alt={product.title}
                        className="h-32 w-32 object-cover"
                      />
                    ) : (
                      <div className="h-32 w-32 bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground text-xs">No image</span>
                      </div>
                    )}
                    <CardContent className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-lg">{product.title}</h3>
                        <Badge variant="secondary" className="capitalize">
                          {product.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary">
                          {Number(product.price)} ETB
                        </span>
                        <Button size="sm">View Details</Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create Product Modal */}
      <CreateProductModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={createProduct}
      />
    </div>
  );
}

interface CreateProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: ReturnType<typeof useCreateProduct>;
}

function CreateProductModal({ open, onOpenChange, onSubmit }: CreateProductModalProps) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProductCategory>(ProductCategory.none);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !price || !description.trim() || category === ProductCategory.none) {
      toast.error('Please fill in all required fields');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    try {
      // Convert images to ExternalBlob
      const imageBlobs: ExternalBlob[] = [];
      for (const file of imageFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
        imageBlobs.push(blob);
      }

      await onSubmit.mutateAsync({
        title: title.trim(),
        price: BigInt(Math.floor(priceNum)),
        description: description.trim(),
        images: imageBlobs,
        category,
      });

      toast.success('Product created successfully!');
      
      // Reset form
      setTitle('');
      setPrice('');
      setDescription('');
      setCategory(ProductCategory.none);
      setImageFiles([]);
      setUploadProgress(0);
      onOpenChange(false);
    } catch (error: any) {
      console.error('Failed to create product:', error);
      toast.error(error.message || 'Failed to create product');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-ethiopian-green to-ethiopian-yellow bg-clip-text text-transparent">
            Add New Product
          </DialogTitle>
          <DialogDescription>
            Fill in the details to list your product for sale
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Product Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter product title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">
              Price (ETB) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select value={category} onValueChange={(value) => setCategory(value as ProductCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ProductCategory.clothing}>Clothing</SelectItem>
                <SelectItem value={ProductCategory.electronics}>Electronics</SelectItem>
                <SelectItem value={ProductCategory.handmade}>Handmade</SelectItem>
                <SelectItem value={ProductCategory.furniture}>Furniture</SelectItem>
                <SelectItem value={ProductCategory.books}>Books</SelectItem>
                <SelectItem value={ProductCategory.art}>Art</SelectItem>
                <SelectItem value={ProductCategory.food}>Food</SelectItem>
                <SelectItem value={ProductCategory.cars}>Cars</SelectItem>
                <SelectItem value={ProductCategory.bikes}>Bikes</SelectItem>
                <SelectItem value={ProductCategory.music}>Music</SelectItem>
                <SelectItem value={ProductCategory.services}>Services</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your product..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Product Images</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="images" className="cursor-pointer">
                <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">
                  {imageFiles.length > 0 ? `${imageFiles.length} file(s) selected` : 'Click to upload images'}
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF up to 10MB
                </p>
              </label>
            </div>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={onSubmit.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={onSubmit.isPending} className="gap-2">
              {onSubmit.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Product
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
