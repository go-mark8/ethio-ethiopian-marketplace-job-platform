import { useState } from 'react';
import { useRegisterUserProfile } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const registerProfile = useRegisterUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      await registerProfile.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });
      toast.success('Welcome to ETHIO🛍! Your profile has been created.');
    } catch (error: any) {
      console.error('Profile registration error:', error);
      const errorMessage = error.message || 'Failed to create profile. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-ethiopian-red via-ethiopian-yellow to-ethiopian-green bg-clip-text text-transparent">
            Welcome to ETHIO🛍
          </DialogTitle>
          <DialogDescription className="text-base">
            Please complete your profile to start using the marketplace
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              disabled={registerProfile.isPending}
              className="h-11"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold">
              Email (Optional)
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={registerProfile.isPending}
              className="h-11"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-semibold">
              Phone (Optional)
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+251 XXX XXX XXX"
              disabled={registerProfile.isPending}
              className="h-11"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full h-11 text-base font-semibold"
            disabled={registerProfile.isPending}
          >
            {registerProfile.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Profile...
              </>
            ) : (
              'Complete Profile'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
