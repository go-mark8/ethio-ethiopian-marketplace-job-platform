import { useGetUserFavorites, useRemoveFavorite } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Heart, ShoppingCart, LogIn, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface FavoritesPageProps {
  onViewProduct: (productId: string) => void;
}

export default function FavoritesPage({ onViewProduct }: FavoritesPageProps) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: favorites, isLoading } = useGetUserFavorites();
  const removeFavorite = useRemoveFavorite();

  const isAuthenticated = !!identity;

  const handleRemoveFavorite = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    
    try {
      await removeFavorite.mutateAsync(productId);
      toast.success('Removed from favorites');
    } catch (error) {
      toast.error('Failed to remove from favorites');
      console.error(error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container px-4 py-12">
        <Card className="max-w-md mx-auto text-center border-2 border-dashed">
          <CardContent className="pt-12 pb-8 space-y-4">
            <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-ethiopian-red/20 to-ethiopian-yellow/20 flex items-center justify-center">
              <Heart className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Your Wishlist</h2>
            <p className="text-muted-foreground">
              Login to view and manage your favorite products
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
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-ethiopian-red to-ethiopian-yellow flex items-center justify-center">
            <Heart className="h-6 w-6 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Favorites</h1>
            <p className="text-muted-foreground">Your saved products</p>
          </div>
        </div>
      </div>

      {/* Favorites List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : !favorites || favorites.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="py-16 text-center">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-bold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-6">
              Start adding products to your wishlist
            </p>
            <Button onClick={() => window.location.reload()} className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Browse Products
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {favorites.map((product) => (
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
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => handleRemoveFavorite(e, product.id)}
                        disabled={removeFavorite.isPending}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                      <Button size="sm" className="gap-2">
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
