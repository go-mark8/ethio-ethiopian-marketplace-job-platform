import { useEffect, useState } from 'react';
import { useGetAllProducts, useIncrementProductViews, useAddFavorite, useRemoveFavorite, useGetUserFavorites, useGetCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../components/ui/carousel';
import { ArrowLeft, Heart, MessageCircle, ShoppingCart, Eye, User, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface ProductDetailsPageProps {
  productId: string;
  onBack: () => void;
  onNavigateToMessages: () => void;
}

export default function ProductDetailsPage({ productId, onBack, onNavigateToMessages }: ProductDetailsPageProps) {
  const { identity } = useInternetIdentity();
  const { data: allProducts, isLoading } = useGetAllProducts();
  const { data: favorites } = useGetUserFavorites();
  const { data: userProfile } = useGetCallerUserProfile();
  const incrementViews = useIncrementProductViews();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const [hasIncrementedView, setHasIncrementedView] = useState(false);

  const product = allProducts?.find(p => p.id === productId);
  const isFavorited = favorites?.some(p => p.id === productId) || false;
  const isOwnProduct = identity && product ? product.seller.toString() === identity.getPrincipal().toString() : false;

  // Increment view count when page loads (only once)
  useEffect(() => {
    if (product && !hasIncrementedView && !isOwnProduct) {
      incrementViews.mutate(productId);
      setHasIncrementedView(true);
    }
  }, [product, productId, hasIncrementedView, isOwnProduct]);

  const handleToggleFavorite = async () => {
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

  const handleMessageSeller = () => {
    if (!identity) {
      toast.error('Please login to message sellers');
      return;
    }
    
    if (isOwnProduct) {
      toast.info('This is your own product');
      return;
    }

    // Navigate to messages page
    onNavigateToMessages();
    toast.success('Opening messages...');
  };

  const handleBuyNow = () => {
    if (!identity) {
      toast.error('Please login to make purchases');
      return;
    }
    
    toast.info('Purchase functionality coming soon!');
  };

  if (isLoading) {
    return (
      <div className="container px-4 py-6 space-y-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-80 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container px-4 py-12">
        <Card className="max-w-md mx-auto text-center border-2 border-dashed">
          <CardContent className="pt-12 pb-8 space-y-4">
            <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold">Product Not Found</h2>
            <p className="text-muted-foreground">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={onBack} className="gap-2 mt-4">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formattedDate = new Date(Number(product.createdAt) / 1000000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2 -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      <div className="container px-4 py-6 space-y-6">
        {/* Image Carousel */}
        {product.images.length > 0 ? (
          <div className="relative">
            <Carousel className="w-full">
              <CarouselContent>
                {product.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                      <img
                        src={image.getDirectURL()}
                        alt={`${product.title} - Image ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {product.images.length > 1 && (
                <>
                  <CarouselPrevious className="left-4" />
                  <CarouselNext className="right-4" />
                </>
              )}
            </Carousel>
            {product.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                {product.images.length} Photos
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-square rounded-2xl bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No images available</span>
          </div>
        )}

        {/* Product Info Card */}
        <Card className="border-2">
          <CardContent className="p-6 space-y-4">
            {/* Title and Category */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-3xl font-black tracking-tight leading-tight flex-1">
                  {product.title}
                </h1>
                <Badge variant="secondary" className="capitalize shrink-0">
                  {product.category}
                </Badge>
              </div>
              
              {/* View Count */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>{Number(product.views)} views</span>
              </div>
            </div>

            {/* Price */}
            <div className="py-4 border-y border-border">
              <div className="text-sm text-muted-foreground mb-1">Price</div>
              <div className="text-4xl font-black text-primary">
                {Number(product.price)} ETB
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h2 className="text-lg font-bold">Description</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            {/* Seller Info */}
            <div className="pt-4 border-t border-border space-y-3">
              <h2 className="text-lg font-bold">Seller Information</h2>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-ethiopian-red via-ethiopian-yellow to-ethiopian-green flex items-center justify-center text-white">
                  <User className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="font-bold">
                    {userProfile?.name || 'Seller'}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {product.seller.toString().slice(0, 20)}...
                  </div>
                </div>
              </div>
              
              {/* Posted Date */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Posted on {formattedDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={handleToggleFavorite}
            disabled={addFavorite.isPending || removeFavorite.isPending}
            className="gap-2"
          >
            <Heart
              className={`h-5 w-5 ${
                isFavorited ? 'fill-primary text-primary' : ''
              }`}
            />
            <span className="hidden sm:inline">
              {isFavorited ? 'Saved' : 'Save'}
            </span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={handleMessageSeller}
            disabled={isOwnProduct}
            className="gap-2"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="hidden sm:inline">Message</span>
          </Button>

          <Button
            size="lg"
            onClick={handleBuyNow}
            disabled={isOwnProduct}
            className="gap-2 bg-gradient-to-r from-ethiopian-green to-ethiopian-yellow hover:opacity-90"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="hidden sm:inline">Buy Now</span>
          </Button>
        </div>

        {isOwnProduct && (
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="p-4 text-center">
              <p className="text-sm font-medium text-primary">
                This is your product listing
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
