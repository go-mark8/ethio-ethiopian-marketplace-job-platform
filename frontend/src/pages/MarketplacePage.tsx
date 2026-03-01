import { useState, useEffect } from 'react';
import { useGetAllProducts, useSearchProducts, useGetProductsByCategory, useAddFavorite, useRemoveFavorite, useGetUserFavorites } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search, Filter, Heart, ShoppingCart } from 'lucide-react';
import { ProductCategory } from '../types';
import { toast } from 'sonner';

const categories: ProductCategory[] = [
  ProductCategory.clothing,
  ProductCategory.electronics,
  ProductCategory.handmade,
  ProductCategory.furniture,
  ProductCategory.books,
  ProductCategory.art,
  ProductCategory.food,
  ProductCategory.cars,
  ProductCategory.bikes,
  ProductCategory.music,
  ProductCategory.services,
];

interface MarketplacePageProps {
  onViewProduct: (productId: string) => void;
}

export default function MarketplacePage({ onViewProduct }: MarketplacePageProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const { identity } = useInternetIdentity();
  
  const allProducts = useGetAllProducts();
  const searchResults = useSearchProducts(searchText);
  const categoryProducts = useGetProductsByCategory(selectedCategory);
  const { data: favorites } = useGetUserFavorites();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const products = searchText
    ? searchResults.data || []
    : selectedCategory
    ? categoryProducts.data || []
    : allProducts.data || [];

  const isLoading = searchText
    ? searchResults.isLoading
    : selectedCategory
    ? categoryProducts.isLoading
    : allProducts.isLoading;

  // Check for category from session storage (from CategoriesPage navigation)
  useEffect(() => {
    const storedCategory = sessionStorage.getItem('selectedCategory');
    if (storedCategory) {
      setSelectedCategory(storedCategory as ProductCategory);
      sessionStorage.removeItem('selectedCategory');
    }
  }, []);

  // Create a Set of favorite product IDs for efficient lookup
  const favoriteIds = new Set(favorites?.map(p => p.id) || []);

  const handleToggleFavorite = async (e: React.MouseEvent, productId: string, isFavorited: boolean) => {
    e.stopPropagation();
    
    if (!identity) {
      toast.error('Please login to save favorites');
      return;
    }

    try {
      if (isFavorited) {
        await removeFavorite.mutateAsync(productId);
        toast.success('Removed from favorites');
      } else {
        await addFavorite.mutateAsync(productId);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
      console.error(error);
    }
  };

  return (
    <div className="container px-4 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-ethiopian-red via-ethiopian-yellow to-ethiopian-green bg-clip-text text-transparent">
          Marketplace
        </h1>
        <p className="text-muted-foreground text-base">
          Discover authentic Ethiopian products
        </p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-11 h-12 text-base"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground shrink-0" />
          <Select
            value={selectedCategory || 'all'}
            onValueChange={(value) => setSelectedCategory(value === 'all' ? null : value as ProductCategory)}
          >
            <SelectTrigger className="flex-1 h-11">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat} className="capitalize">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-44" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="py-16 text-center">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-bold mb-2">No products found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {products.map((product) => {
            const isFavorited = favoriteIds.has(product.id);
            
            return (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 group cursor-pointer"
                onClick={() => onViewProduct(product.id)}
              >
                <div className="flex gap-4">
                  {product.images.length > 0 ? (
                    <div className="relative h-40 w-40 shrink-0 overflow-hidden">
                      <img
                        src={product.images[0].getDirectURL()}
                        alt={product.title}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <button
                        onClick={(e) => handleToggleFavorite(e, product.id, isFavorited)}
                        className="absolute top-2 right-2 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95"
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            isFavorited ? 'fill-primary text-primary' : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                    </div>
                  ) : (
                    <div className="h-40 w-40 shrink-0 bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground text-xs">No image</span>
                    </div>
                  )}
                  <CardContent className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                          {product.title}
                        </h3>
                        <Badge variant="secondary" className="capitalize ml-2 shrink-0">
                          {product.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-primary">
                        {Number(product.price)} ETB
                      </span>
                      <Button size="sm" className="gap-2">
                        View
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
