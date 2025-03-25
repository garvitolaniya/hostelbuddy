import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UserAvatar from './UserAvatar';
import { Button } from '@/components/ui/button';
import { MessageSquare, UserCog, LogOut, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, switchRole } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavItems = () => (
    <>
      <Link to="/">
        <Button 
          variant={isActive('/') ? 'default' : 'ghost'}
          className="flex items-center gap-2"
        >
          <MessageSquare size={16} />
          <span>Chat</span>
        </Button>
      </Link>
      {user && (
        <Link to="/admin">
          <Button 
            variant={isActive('/admin') ? 'default' : 'ghost'}
            className="flex items-center gap-2"
          >
            <UserCog size={16} />
            <span>Admin</span>
          </Button>
        </Link>
      )}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <h1 className="font-display text-xl font-bold">Hostel Helper</h1>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <NavItems />
            </nav>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="py-4">
                  <h2 className="text-lg font-semibold mb-4">Navigation</h2>
                  <nav className="flex flex-col gap-2">
                    <NavItems />
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-1">
                    <UserAvatar name={user.name} avatarUrl={user.avatar} size="sm" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.role}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={switchRole}>
                    <UserCog size={16} className="mr-2" />
                    Switch to {user.role === 'admin' ? 'User' : 'Admin'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="default" size="sm">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container py-6">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <div className="container">
          <p>© {new Date().getFullYear()} Hostel Helper Buddy</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
