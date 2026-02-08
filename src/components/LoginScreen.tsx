import { useState, useEffect } from 'react';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import xpWallpaper from '@/assets/xp-wallpaper.jpg';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-[9998] transition-all duration-700 ${
        isLoggingIn ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
      }`}
    >
      {/* XP Welcome Screen Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #245edc 0%, #1a4eb8 30%, #4c7fe0 50%, #1a4eb8 70%, #245edc 100%)',
        }}
      />

      {/* Top gradient bar */}
      <div 
        className="absolute top-0 left-0 right-0 h-[60px]"
        style={{
          background: 'linear-gradient(to bottom, #3166d1 0%, #4183e0 50%, #245cc8 100%)',
          borderBottom: '2px solid #1a4eb8',
        }}
      />

      {/* "Windows XP" branding */}
      <div className="absolute top-4 left-6 flex items-center gap-3">
        <svg width="40" height="40" viewBox="0 0 100 100" className="drop-shadow-lg">
          <path d="M5 10 L45 15 L45 45 L5 45 Z" fill="#F25022" />
          <path d="M50 15 L95 10 L95 45 L50 45 Z" fill="#7FBA00" />
          <path d="M5 50 L45 50 L45 85 L5 90 Z" fill="#00A4EF" />
          <path d="M50 50 L95 50 L95 90 L50 85 Z" fill="#FFB900" />
        </svg>
        <div>
          <span className="text-white text-2xl font-light tracking-tight">Windows</span>
          <span className="text-white text-2xl font-bold italic ml-1">XP</span>
        </div>
      </div>

      {/* Main Login Panel */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
        <div 
          className="w-[320px] rounded-lg overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #6f9fdc 0%, #5588cc 2%, #3b6eb8 98%, #2a5aa0 100%)',
            border: '2px solid #1a4488',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          {/* User info section */}
          <div className="p-4 flex items-center gap-4 border-b border-[#1a4488]/50">
            {/* User avatar */}
            <div 
              className="w-16 h-16 rounded border-2 border-white/50 flex items-center justify-center text-white font-bold text-xl"
              style={{
                background: 'linear-gradient(135deg, #4a90d9 0%, #2157d7 100%)',
              }}
            >
              KJM
            </div>
            <div className="flex-1">
              <h2 className="text-white font-bold text-lg drop-shadow">Kiseko Joseph</h2>
              <p className="text-white/80 text-xs">Computer Science Portfolio</p>
            </div>
          </div>

          {/* Password section */}
          <div className="p-4">
            <label className="text-white text-xs font-medium mb-2 block">
              Type your password (or just press Enter):
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-8 bg-white border-0 text-black text-sm rounded-sm pr-8"
                  autoFocus
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button
                onClick={handleLogin}
                className="w-8 h-8 flex items-center justify-center rounded-sm transition-all"
                style={{
                  background: 'linear-gradient(180deg, #5ebe5e 0%, #3d9f3d 50%, #2d8f2d 51%, #1d7f1d 100%)',
                  border: '1px solid #1a6f1a',
                }}
              >
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[50px] flex items-center justify-between px-6"
        style={{
          background: 'linear-gradient(to top, #2a5298 0%, #3b6eb8 100%)',
          borderTop: '2px solid #1a4488',
        }}
      >
        <div className="text-white/70 text-xs">
          Welcome to the portfolio
        </div>
        <div className="text-white/70 text-xs">
          After logging in, double-click icons to explore
        </div>
      </div>
    </div>
  );
}
