import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { User, Mail, Phone, LogIn } from 'lucide-react';

export default function ProfilePage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: profile, isLoading } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container px-4 py-12">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-12 pb-8">
            <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <User className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">Login Required</h2>
            <p className="text-muted-foreground mb-6">
              Please login to view your profile
            </p>
            <Button
              onClick={login}
              disabled={loginStatus === 'logging-in'}
              className="gap-2"
            >
              <LogIn className="h-4 w-4" />
              {loginStatus === 'logging-in' ? 'Logging in...' : 'Login'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container px-4 py-6 space-y-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container px-4 py-12">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-12 pb-8">
            <p className="text-muted-foreground">Setting up your profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container px-4 py-6 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1">Profile</h1>
        <p className="text-muted-foreground">Manage your account</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-ethiopian-red via-ethiopian-yellow to-ethiopian-green flex items-center justify-center text-white text-2xl font-bold">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <CardTitle className="text-xl">{profile.name}</CardTitle>
              <p className="text-sm text-muted-foreground">Member</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.email && (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{profile.email}</p>
              </div>
            </div>
          )}
          
          {profile.phone && (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <Phone className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{profile.phone}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Principal ID</span>
              <span className="font-mono text-xs">
                {identity?.getPrincipal().toString().slice(0, 10)}...
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Member Since</span>
              <span>
                {new Date(Number(profile.createdAt) / 1000000).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
