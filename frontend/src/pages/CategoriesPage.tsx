import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ProductCategory } from '../types';
import { 
  Shirt, 
  Laptop, 
  Palette, 
  Armchair, 
  BookOpen, 
  Frame, 
  UtensilsCrossed, 
  Wrench, 
  Music,
  Car,
  Bike
} from 'lucide-react';

interface CategoriesPageProps {
  onNavigate: (tab: 'marketplace') => void;
}

const categoryData: Array<{
  category: ProductCategory;
  icon: React.ReactNode;
  image: string;
  color: string;
  count?: number;
}> = [
  {
    category: ProductCategory.clothing,
    icon: <Shirt className="h-8 w-8" />,
    image: '/assets/generated/featured-textiles.dim_400x300.jpg',
    color: 'from-ethiopian-red/20 to-ethiopian-red/5',
  },
  {
    category: ProductCategory.food,
    icon: <UtensilsCrossed className="h-8 w-8" />,
    image: '/assets/generated/featured-spices.dim_400x300.jpg',
    color: 'from-ethiopian-yellow/20 to-ethiopian-yellow/5',
  },
  {
    category: ProductCategory.handmade,
    icon: <Palette className="h-8 w-8" />,
    image: '/assets/generated/crafts-category.dim_300x300.jpg',
    color: 'from-ethiopian-green/20 to-ethiopian-green/5',
  },
  {
    category: ProductCategory.art,
    icon: <Frame className="h-8 w-8" />,
    image: '/assets/generated/featured-jewelry.dim_400x300.jpg',
    color: 'from-primary/20 to-primary/5',
  },
  {
    category: ProductCategory.electronics,
    icon: <Laptop className="h-8 w-8" />,
    image: '/assets/generated/city-backdrop.dim_600x400.jpg',
    color: 'from-accent/20 to-accent/5',
  },
  {
    category: ProductCategory.furniture,
    icon: <Armchair className="h-8 w-8" />,
    image: '/assets/generated/featured-coffee.dim_400x300.jpg',
    color: 'from-secondary/20 to-secondary/5',
  },
  {
    category: ProductCategory.books,
    icon: <BookOpen className="h-8 w-8" />,
    image: '/assets/generated/coffee-category.dim_300x300.jpg',
    color: 'from-muted/40 to-muted/10',
  },
  {
    category: ProductCategory.cars,
    icon: <Car className="h-8 w-8" />,
    image: '/assets/generated/cars-category.dim_300x300.jpg',
    color: 'from-chart-2/20 to-chart-2/5',
  },
  {
    category: ProductCategory.bikes,
    icon: <Bike className="h-8 w-8" />,
    image: '/assets/generated/bikes-category.dim_300x300.jpg',
    color: 'from-chart-4/20 to-chart-4/5',
  },
  {
    category: ProductCategory.services,
    icon: <Wrench className="h-8 w-8" />,
    image: '/assets/generated/city-backdrop.dim_600x400.jpg',
    color: 'from-chart-1/20 to-chart-1/5',
  },
  {
    category: ProductCategory.music,
    icon: <Music className="h-8 w-8" />,
    image: '/assets/generated/featured-textiles.dim_400x300.jpg',
    color: 'from-chart-3/20 to-chart-3/5',
  },
];

export default function CategoriesPage({ onNavigate }: CategoriesPageProps) {
  const handleCategoryClick = (category: ProductCategory) => {
    // Store selected category in sessionStorage for MarketplacePage to read
    sessionStorage.setItem('selectedCategory', category);
    onNavigate('marketplace');
  };

  return (
    <div className="container px-4 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-ethiopian-red via-ethiopian-yellow to-ethiopian-green bg-clip-text text-transparent">
          Browse Categories
        </h1>
        <p className="text-muted-foreground text-base">
          Explore authentic Ethiopian products by category
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 gap-4">
        {categoryData.map(({ category, icon, image, color, count }) => (
          <Card
            key={category}
            className="group overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 active:scale-95 border-2 hover:border-primary/50"
            onClick={() => handleCategoryClick(category)}
          >
            <div className="relative h-32 overflow-hidden">
              <img
                src={image}
                alt={category}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${color} group-hover:opacity-80 transition-opacity`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-foreground/90 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                  {icon}
                </div>
              </div>
            </div>
            <CardContent className="p-4 text-center">
              <h3 className="font-bold text-base capitalize mb-1 group-hover:text-primary transition-colors">
                {category}
              </h3>
              {count !== undefined && (
                <Badge variant="secondary" className="text-xs">
                  {count} items
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Featured Banner */}
      <Card className="overflow-hidden bg-gradient-to-br from-ethiopian-red/10 via-ethiopian-yellow/10 to-ethiopian-green/10 border-2 border-primary/20">
        <CardContent className="p-6 text-center space-y-2">
          <h3 className="text-xl font-bold">Discover Ethiopian Heritage</h3>
          <p className="text-sm text-muted-foreground">
            Each category showcases authentic products from Ethiopian artisans and sellers
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
