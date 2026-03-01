import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { LogIn, LogOut, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Header() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoading = loginStatus === 'logging-in' || loginStatus === 'initializing';

  const handleAuth = async () => {
    if (isAuthenticated) {
      try {
        await clear();
        queryClient.clear();
        toast.success('Logged out successfully');
      } catch (error: any) {
        console.error('Logout error:', error);
        toast.error('Failed to logout');
      }
    } else {
      try {
        await login();
        toast.success('Logged in successfully');
      } catch (error: any) {
        console.error('Login error:', error);
        
        // Handle the case where user is already authenticated
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => {
            login();
          }, 300);
        } else {
          toast.error('Login failed. Please try again.');
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-lg supports-[backdrop-filter]:bg-card/80 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-black bg-gradient-to-r from-ethiopian-red via-ethiopian-yellow to-ethiopian-green bg-clip-text text-transparent tracking-tight">
            ETHIO🛍
          </div>
        </div>
        
        <Button
          onClick={handleAuth}
          disabled={isLoading}
          variant={isAuthenticated ? 'outline' : 'default'}
          size="sm"
          className="gap-2 min-w-[100px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : isAuthenticated ? (
            <>
              <LogOut className="h-4 w-4" />
              Logout
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              Login
            </>
          )}
        </Button>
      </div>
    </header>
  );
}
