import { useState } from 'react';
import { Bell, Globe, LogIn, UserPlus, User, ArrowRight } from 'lucide-react';
import { Language } from '../../lib/i18n';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { AuthDialog } from '../profile/AuthDialog';
import { useAuth } from '../../hooks/useAuth';
import { useWallet } from '../../hooks/useWallet';
import { shortenAddress } from '../../lib/web3';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export function Header({ language, onLanguageChange }: HeaderProps) {
  const { user } = useAuth();
  const { account } = useWallet();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const languages: { code: Language; label: string }[] = [
    { code: 'uz', label: 'O\'zbek' },
    { code: 'ru', label: 'Русский' },
    { code: 'en', label: 'English' },
  ];

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthDialogOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-game-darker/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 gap-2">
          {/* Left side - Notifications */}
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Bell className="w-5 h-5" />
          </Button>

          {/* Center - Logo */}
          <div className="flex items-center gap-2">
            <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-game-gold to-game-green bg-clip-text text-transparent">
              Seka Svara
            </div>
          </div>

          {/* Right side - Actions matching image layout */}
          <div className="flex items-center gap-2">
            {/* Arrow icon (for quick navigation) */}
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <ArrowRight className="w-5 h-5" />
            </Button>
            
            {/* User/Profile icon */}
            {user || account ? (
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <User className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                onClick={() => handleOpenAuth('register')}
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
              >
                <UserPlus className="w-5 h-5" />
              </Button>
            )}

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <Globe className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-game-cardBg border-border">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => onLanguageChange(lang.code)}
                    className={`cursor-pointer ${
                      language === lang.code
                        ? 'bg-game-gold/20 text-game-gold'
                        : 'text-foreground hover:bg-game-cardHover'
                    }`}
                  >
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Auth Dialog */}
      <AuthDialog open={authDialogOpen} onClose={() => setAuthDialogOpen(false)} />
    </>
  );
}
