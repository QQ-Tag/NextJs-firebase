'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, UserCircle, LogOut, ShieldCheck, LayoutDashboard, ScanLine, UserPlus, LogInIcon } from 'lucide-react';
import { Separator } from '../ui/separator';

export function Header() {
  const { currentUser, isAdmin, logout, loading } = useAuth();

  const commonLinks = [
    { href: '/', label: 'Home', icon: <LayoutDashboard /> },
  ];

  const guestLinks = [
    ...commonLinks,
    { href: '/login', label: 'Login', icon: <LogInIcon /> },
    { href: '/signup', label: 'Sign Up', icon: <UserPlus /> },
    { href: '/admin/login', label: 'Admin Login', icon: <ShieldCheck /> },
  ];

  const userLinks = [
    ...commonLinks,
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
    { href: '/profile', label: 'Profile', icon: <UserCircle /> },
  ];

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Admin Dashboard', icon: <ShieldCheck /> },
  ];

  const links = isAdmin ? adminLinks : currentUser ? userLinks : guestLinks;

  const NavLinks = ({ inSheet = false }: { inSheet?: boolean }) => (
    <>
      {links.map((link) => (
        <Button key={link.href} variant={inSheet ? "ghost" : "link"} asChild className={inSheet ? "justify-start w-full text-base py-3" : "text-foreground hover:text-primary"}>
          <Link href={link.href} className="flex items-center gap-2">
            {inSheet && link.icon}
            {link.label}
          </Link>
        </Button>
      ))}
      {(currentUser || isAdmin) && (
        <Button variant={inSheet ? "ghost" : "outline"} onClick={logout} className={inSheet ? "justify-start w-full text-base py-3 text-destructive hover:text-destructive" : ""}>
           {inSheet && <LogOut />}
          Logout
        </Button>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center space-x-2 md:flex">
          {!loading && <NavLinks />}
        </nav>
        <div className="md:hidden">
          {!loading && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-6">
                <SheetHeader>
                  <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-4 mb-6">
                  <Logo />
                </div>
                <Separator className="my-4" />
                <nav className="flex flex-col space-y-2">
                  <NavLinks inSheet={true} />
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}
