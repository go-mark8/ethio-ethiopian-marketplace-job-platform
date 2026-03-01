import { useGetHomeDiscover, useGetTopViewedProducts } from '../hooks/useQueries';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { ShoppingBag, Briefcase, TrendingUp, Heart, ArrowRight, Sparkles, Eye } from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: 'marketplace' | 'categories' | 'jobs') => void;
  onViewProduct: (productId: string) => void;
}

export default function HomePage({ onNavigate, onViewProduct }: HomePageProps) {
  const { data, isLoading } = useGetHomeDiscover();
  const { data: topViewedProducts, isLoading: topViewedLoading } = useGetTopViewedProducts(8);

  if (isLoading) {
    return (
      <div className="container px-4 py-6 space-y-6">
        <Skeleton className="h-56 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-6 space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ethiopian-red via-ethiopian-yellow to-ethiopian-green p-8 text-white shadow-2xl">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 animate-pulse" />
            <span className="text-sm font-bold uppercase tracking-wider">Welcome</span>
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tight">
            Discover Ethiopian
            <br />
            Marketplace
          </h1>
          <p className="text-white/90 text-base max-w-md">
            Authentic products, local opportunities, and vibrant community
          </p>
          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => onNavigate('marketplace')}
              variant="secondary"
              className="gap-2 font-bold shadow-lg hover:scale-105 transition-transform"
            >
              <ShoppingBag className="h-4 w-4" />
              Shop Now
            </Button>
            <Button
              onClick={() => onNavigate('categories')}
              variant="outline"
              className="gap-2 font-bold bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:text-white"
            >
              Browse
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <img
          src="/assets/generated/hero-marketplace.dim_800x400.jpg"
          alt="Marketplace"
          className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-overlay"
        />
      </div>

      {/* Top Viewing Items Section */}
      {topViewedProducts && topViewedProducts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-black tracking-tight">Top Viewing Items</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('marketplace')}
              className="gap-1"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          {topViewedLoading ? (
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 px-4">
              <div className="flex gap-4 pb-2">
                {topViewedProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="flex-shrink-0 w-64 overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 group cursor-pointer"
                    onClick={() => onViewProduct(product.id)}
                  >
                    {product.images.length > 0 && (
                      <div className="relative h-48 w-full overflow-hidden">
                        <img
                          src={product.images[0].getDirectURL()}
                          alt={product.title}
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2">
                          <div className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                            <Heart className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <Badge variant="secondary" className="gap-1 bg-white/90 backdrop-blur-sm">
                            <Eye className="h-3 w-3" />
                            {Number(product.views)}
                          </Badge>
                        </div>
                      </div>
                    )}
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <h3 className="font-bold text-base line-clamp-1 group-hover:text-primary transition-colors">
                          {product.title}
                        </h3>
                        <Badge variant="outline" className="capitalize text-xs mt-1">
                          {product.category}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-black text-primary">
                          {Number(product.price)} ETB
                        </span>
                        <Button size="sm" variant="ghost" className="gap-1 text-xs">
                          View
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Card
          className="cursor-pointer hover:shadow-xl transition-all duration-300 active:scale-95 border-2 hover:border-primary/50 bg-gradient-to-br from-ethiopian-red/10 to-ethiopian-red/5"
          onClick={() => onNavigate('categories')}
        >
          <CardContent className="p-6 text-center space-y-3">
            <div className="h-14 w-14 mx-auto rounded-2xl bg-ethiopian-red/20 flex items-center justify-center">
              <ShoppingBag className="h-7 w-7 text-ethiopian-red" />
            </div>
            <div>
              <p className="text-2xl font-black">{data?.categories.filter(c => c !== 'none').length || 0}</p>
              <p className="text-sm font-bold text-muted-foreground">Categories</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-xl transition-all duration-300 active:scale-95 border-2 hover:border-primary/50 bg-gradient-to-br from-ethiopian-green/10 to-ethiopian-green/5"
          onClick={() => onNavigate('jobs')}
        >
          <CardContent className="p-6 text-center space-y-3">
            <div className="h-14 w-14 mx-auto rounded-2xl bg-ethiopian-green/20 flex items-center justify-center">
              <Briefcase className="h-7 w-7 text-ethiopian-green" />
            </div>
            <div>
              <p className="text-2xl font-black">New</p>
              <p className="text-sm font-bold text-muted-foreground">Opportunities</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Products */}
      {data?.featuredProducts && data.featuredProducts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-black tracking-tight">Featured</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('marketplace')}
              className="gap-1"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {data.featuredProducts.slice(0, 3).map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 group cursor-pointer"
                onClick={() => onViewProduct(product.id)}
              >
                <div className="flex gap-4">
                  {product.images.length > 0 && (
                    <div className="relative h-36 w-36 shrink-0 overflow-hidden">
                      <img
                        src={product.images[0].getDirectURL()}
                        alt={product.title}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2">
                        <div className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                          <Heart className="h-4 w-4 text-primary" />
                        </div>
                      </div>
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
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Categories Preview */}
      {data?.categories && data.categories.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight">Popular Categories</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('categories')}
              className="gap-1"
            >
              See All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {data.categories.filter(cat => cat !== 'none').slice(0, 6).map((category) => (
              <Card
                key={category}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer active:scale-95 border-2 hover:border-primary/50"
                onClick={() => onNavigate('categories')}
              >
                <CardContent className="p-4 text-center space-y-2">
                  <div className="h-12 w-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-bold text-sm capitalize line-clamp-1">{category}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
