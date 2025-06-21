'use client';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, UserCircle, LogOut, ShieldCheck, LayoutDashboard, ScanLine, UserPlus, LogInIcon } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback } from '../ui/avatar';

export function Header() {
  const { currentUser, isAdmin, logout, loading } = useAuth();
  
  const commonLinks = [
    { href: '/', label: 'Home', icon: <LayoutDashboard className="w-4 h-4" /> },
  ];
  
  const guestLinks = [
    ...commonLinks,
    { href: '/login', label: 'Login', icon: <LogInIcon className="w-4 h-4" /> },
    { href: '/signup', label: 'Sign Up', icon: <UserPlus className="w-4 h-4" /> },
    { href: '/admin/login', label: 'Admin Login', icon: <ShieldCheck className="w-4 h-4" /> },
  ];
  
  const userLinks = [
    ...commonLinks,
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/profile', label: 'Profile', icon: <UserCircle className="w-4 h-4" /> },
  ];
  
  const adminLinks = [
    { href: '/admin/dashboard', label: 'Admin Dashboard', icon: <ShieldCheck className="w-4 h-4" /> },
  ];
  
  const links = isAdmin ? adminLinks : currentUser ? userLinks : guestLinks;
  
  const NavLinks = ({ inSheet = false }: { inSheet?: boolean }) => (
    <>
      {links.map((link) => (
        <Button 
          key={link.href} 
          variant={inSheet ? "ghost" : "ghost"} 
          asChild 
          className={inSheet 
            ? "justify-start w-full text-base py-3 h-auto hover:bg-primary/10 hover:text-primary transition-colors" 
            : "text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
          }
        >
          <Link href={link.href} className="flex items-center gap-3">
            {inSheet && link.icon}
            {link.label}
          </Link>
        </Button>
      ))}
      {(currentUser || isAdmin) && (
        <>
          {inSheet && currentUser && (
            <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border mt-4 mb-2">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                  {currentUser.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{currentUser.name || 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
              </div>
            </div>
          )}
          
          {inSheet && isAdmin && !currentUser && (
            <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800 mt-4 mb-2">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </div>
          )}
          
          <Button 
            variant={inSheet ? "ghost" : "outline"} 
            onClick={logout} 
            className={inSheet 
              ? "justify-start w-full text-base py-3 h-auto text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors" 
              : "border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
            }
          >
            {inSheet && <LogOut className="w-4 h-4" />}
            Logout
          </Button>
        </>
      )}
    </>
  );

  // Desktop User Avatar Component
  const DesktopUserAvatar = () => {
    if (currentUser) {
      return (
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
            {currentUser.name?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
      );
    }
    
    if (isAdmin) {
      return (
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
          <ShieldCheck className="w-4 h-4 text-white" />
        </div>
      );
    }
    
    return null;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Logo />
        
        <nav className="hidden items-center space-x-1 md:flex">
          {!loading && (
            <>
              <NavLinks />
              {(currentUser || isAdmin) && (
                <>
                  <Separator orientation="vertical" className="h-6 mx-3" />
                  <DesktopUserAvatar />
                </>
              )}
            </>
          )}
        </nav>
        
        <div className="md:hidden">
          {!loading && (
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="border-border/40 hover:bg-primary/10 transition-colors"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] sm:w-[400px] p-0">
                <div className="flex flex-col h-full">
                  <SheetHeader className="p-6 pb-4 border-b">
                    <SheetTitle className="text-left">
                      <Logo />
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="flex-1 px-6 py-4">
                    <nav className="flex flex-col space-y-1">
                      <NavLinks inSheet={true} />
                    </nav>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}