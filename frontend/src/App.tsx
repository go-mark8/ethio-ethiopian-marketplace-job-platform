import { useEffect, useState } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { Home, ShoppingBag, Briefcase, User, Heart, MessageCircle, Store, Grid3x3 } from 'lucide-react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import MarketplacePage from './pages/MarketplacePage';
import JobsPage from './pages/JobsPage';
import ProfilePage from './pages/ProfilePage';
import CategoriesPage from './pages/CategoriesPage';
import FavoritesPage from './pages/FavoritesPage';
import MessagesPage from './pages/MessagesPage';
import SellerListingsPage from './pages/SellerListingsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ProfileSetupModal from './components/ProfileSetupModal';
import SplashScreen from './components/SplashScreen';
import { Toaster } from './components/ui/sonner';

type TabType = 'home' | 'marketplace' | 'jobs' | 'profile' | 'categories' | 'favorites' | 'messages' | 'seller' | 'product-details';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Telegram WebApp integration
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.enableClosingConfirmation();
    }
  }, []);

  // Handle splash screen
  useEffect(() => {
    if (!isInitializing) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isInitializing]);

  const handleViewProduct = (productId: string) => {
    setSelectedProductId(productId);
    setActiveTab('product-details');
  };

  const handleBackFromProductDetails = () => {
    setSelectedProductId(null);
    setActiveTab('home');
  };

  if (showSplash || isInitializing) {
    return <SplashScreen />;
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1 overflow-y-auto pb-24">
        <div className={activeTab === 'home' ? 'block animate-in fade-in duration-300' : 'hidden'}>
          <HomePage onNavigate={setActiveTab} onViewProduct={handleViewProduct} />
        </div>
        <div className={activeTab === 'marketplace' ? 'block animate-in fade-in duration-300' : 'hidden'}>
          <MarketplacePage onViewProduct={handleViewProduct} />
        </div>
        <div className={activeTab === 'categories' ? 'block animate-in fade-in duration-300' : 'hidden'}>
          <CategoriesPage onNavigate={setActiveTab} />
        </div>
        <div className={activeTab === 'favorites' ? 'block animate-in fade-in duration-300' : 'hidden'}>
          <FavoritesPage onViewProduct={handleViewProduct} />
        </div>
        <div className={activeTab === 'seller' ? 'block animate-in fade-in duration-300' : 'hidden'}>
          <SellerListingsPage onViewProduct={handleViewProduct} />
        </div>
        <div className={activeTab === 'messages' ? 'block animate-in fade-in duration-300' : 'hidden'}>
          <MessagesPage />
        </div>
        <div className={activeTab === 'jobs' ? 'block animate-in fade-in duration-300' : 'hidden'}>
          <JobsPage />
        </div>
        <div className={activeTab === 'profile' ? 'block animate-in fade-in duration-300' : 'hidden'}>
          <ProfilePage />
        </div>
        <div className={activeTab === 'product-details' ? 'block animate-in fade-in duration-300' : 'hidden'}>
          {selectedProductId && (
            <ProductDetailsPage 
              productId={selectedProductId} 
              onBack={handleBackFromProductDetails}
              onNavigateToMessages={() => setActiveTab('messages')}
            />
          )}
        </div>
      </main>

      {/* Bottom Navigation - Single Row with 8 Items */}
      {activeTab !== 'product-details' && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg shadow-2xl safe-area-inset-bottom">
          <div className="grid grid-cols-8 gap-0.5 px-1 py-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 transition-all duration-200 ${
                activeTab === 'home'
                  ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md scale-105'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground active:scale-95'
              }`}
            >
              <Home className={`h-4 w-4 ${activeTab === 'home' ? 'animate-in zoom-in duration-200' : ''}`} />
              <span className="text-[9px] font-semibold leading-tight">Home</span>
            </button>
            
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 transition-all duration-200 ${
                activeTab === 'categories'
                  ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md scale-105'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground active:scale-95'
              }`}
            >
              <Grid3x3 className={`h-4 w-4 ${activeTab === 'categories' ? 'animate-in zoom-in duration-200' : ''}`} />
              <span className="text-[9px] font-semibold leading-tight">Browse</span>
            </button>
            
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`flex flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 transition-all duration-200 ${
                activeTab === 'marketplace'
                  ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md scale-105'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground active:scale-95'
              }`}
            >
              <ShoppingBag className={`h-4 w-4 ${activeTab === 'marketplace' ? 'animate-in zoom-in duration-200' : ''}`} />
              <span className="text-[9px] font-semibold leading-tight">Shop</span>
            </button>
            
            <button
              onClick={() => setActiveTab('seller')}
              className={`flex flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 transition-all duration-200 ${
                activeTab === 'seller'
                  ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md scale-105'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground active:scale-95'
              }`}
            >
              <Store className={`h-4 w-4 ${activeTab === 'seller' ? 'animate-in zoom-in duration-200' : ''}`} />
              <span className="text-[9px] font-semibold leading-tight">Sell</span>
            </button>
            
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 transition-all duration-200 ${
                activeTab === 'favorites'
                  ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md scale-105'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground active:scale-95'
              }`}
            >
              <Heart className={`h-4 w-4 ${activeTab === 'favorites' ? 'animate-in zoom-in duration-200 fill-current' : ''}`} />
              <span className="text-[9px] font-semibold leading-tight">Saved</span>
            </button>
            
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 transition-all duration-200 ${
                activeTab === 'messages'
                  ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md scale-105'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground active:scale-95'
              }`}
            >
              <MessageCircle className={`h-4 w-4 ${activeTab === 'messages' ? 'animate-in zoom-in duration-200' : ''}`} />
              <span className="text-[9px] font-semibold leading-tight">Chat</span>
            </button>
            
            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 transition-all duration-200 ${
                activeTab === 'jobs'
                  ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md scale-105'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground active:scale-95'
              }`}
            >
              <Briefcase className={`h-4 w-4 ${activeTab === 'jobs' ? 'animate-in zoom-in duration-200' : ''}`} />
              <span className="text-[9px] font-semibold leading-tight">Jobs</span>
            </button>
            
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 transition-all duration-200 ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md scale-105'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground active:scale-95'
              }`}
            >
              <User className={`h-4 w-4 ${activeTab === 'profile' ? 'animate-in zoom-in duration-200' : ''}`} />
              <span className="text-[9px] font-semibold leading-tight">Profile</span>
            </button>
          </div>
        </nav>
      )}

      {showProfileSetup && <ProfileSetupModal />}
      <Toaster />
    </div>
  );
}
