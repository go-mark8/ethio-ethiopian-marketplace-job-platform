import { useEffect, useState } from 'react';
import { Progress } from './ui/progress';

export default function SplashScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 25);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-black relative overflow-hidden">
      {/* Centered App Title */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8">
        <div className="text-center space-y-3 animate-in fade-in zoom-in duration-700">
          <h1 className="text-6xl font-black text-white drop-shadow-lg tracking-tight">
            ETHIO🛍
          </h1>
          <p className="text-gray-300 text-lg font-medium tracking-wide">
            Ethiopian Marketplace & Jobs
          </p>
        </div>
      </div>

      {/* Bottom Loading Bar - Fixed to bottom edge */}
      <div className="relative z-10 w-full px-6 pb-8 space-y-3 animate-in slide-in-from-bottom duration-500">
        <Progress 
          value={progress} 
          className="h-1.5 bg-gray-800"
        />
        <p className="text-center text-gray-400 text-sm font-medium">
          Loading your marketplace...
        </p>
      </div>
    </div>
  );
}
