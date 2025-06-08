'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  AlertTriangle, 
  MapPin, 
  BarChart3, 
  FileText,
  Users,
  LogOut,
  Home,
  Bell,
  Plus,
  Search,
  Shield,
  Activity,
  Settings,
  ChevronRight,
  Zap,
  Globe,
  Radio,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { User } from '@/types';
import { NotificationPanel } from '@/components/notifications/NotificationPanel';
import { useNotifications } from '@/lib/hooks/useNotifications';

interface HeaderProps {
  user?: User | null;
}

function NavLink({ 
  href, 
  children, 
  label, 
  isActive,
  onClick
}: { 
  href: string; 
  children: React.ReactNode; 
  label: string;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'transition-all duration-200 w-full px-3 py-2 rounded-md flex items-center gap-2 text-xs font-medium',
        isActive
          ? 'bg-white/10 text-white border-l-2 border-red-400'
          : 'text-white/60 hover:bg-white/5 hover:text-white'
      )}
    >
      <div className={cn(
        'transition-colors duration-200',
        isActive ? 'text-red-400' : 'text-white/70'
      )}>
        {children}
      </div>
      <span className="transition-colors duration-200">
        {label}
      </span>
    </Link>
  );
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [newRequestModalOpen, setNewRequestModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isCoordinator = user?.role === 'regional_coordinator';
  
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

  useEffect(() => {
    // Initialize menu state based on screen size
    setIsOpen(window.innerWidth >= 768);
  }, []);

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        className="fixed top-4 left-4 z-[60] md:hidden glass border border-white/10 p-2 rounded-xl shadow-2xl backdrop-blur-xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Menu className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Navigation Sidebar */}
      <div 
        className={cn(
          "fixed top-0 left-0 z-50 h-full glass-ultra sidebar-elevated overflow-y-auto transition-all duration-300 ease-out",
          "w-full md:w-52",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="w-full h-full flex flex-col items-center relative">
          {/* Logo Section */}
          <div className="flex w-full px-4 py-6 justify-center items-center border-b border-white/10">
            <Link
              href="/"
              className="flex flex-col items-center text-white group text-center"
              title="Crisis Data Response Platform"
              onClick={() => setIsOpen(false)}
            >
              <img 
                src="/cdrp-logo.png" 
                alt="CDRP - Crisis Data Response Platform"
                className="w-28 h-28 rounded-2xl shadow-2xl mb-4 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="text-white font-bold text-2xl tracking-wide mb-1">
                CDRP
              </div>
              <div className="text-white/70 text-xs font-medium">
                Crisis Data Response Platform
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 w-full flex flex-col mt-6 px-4 space-y-1">
            {/* Main Navigation */}
            <div className="space-y-1">
              <NavLink 
                href="/" 
                label="Dashboard" 
                isActive={pathname === '/' || pathname === '/dashboard'}
                onClick={() => setIsOpen(false)}
              >
                <Home className="h-5 w-5" />
              </NavLink>

              <NavLink 
                href="/requests" 
                label="Emergency Requests" 
                isActive={pathname.startsWith('/requests')}
                onClick={() => setIsOpen(false)}
              >
                <FileText className="h-5 w-5" />
              </NavLink>

              <NavLink 
                href="/map" 
                label="Live Map" 
                isActive={pathname === '/map'}
                onClick={() => setIsOpen(false)}
              >
                <MapPin className="h-5 w-5" />
              </NavLink>

              <NavLink 
                href="/analytics" 
                label="Analytics" 
                isActive={pathname.startsWith('/analytics')}
                onClick={() => setIsOpen(false)}
              >
                <BarChart3 className="h-5 w-5" />
              </NavLink>

            </div>

            {/* Data Sources Navigation */}
            <div className="mt-6 pt-4 border-t border-white/10 space-y-1">
              <div className="text-xs font-semibold text-white/40 uppercase tracking-wider px-3 mb-2">
                Data Sources
              </div>
              
              <NavLink 
                href="/data-sources" 
                label="All Data Sources" 
                isActive={pathname === '/data-sources'}
                onClick={() => setIsOpen(false)}
              >
                <Activity className="h-5 w-5" />
              </NavLink>
              
              <NavLink 
                href="/data/earthquakes" 
                label="Earthquake Data" 
                isActive={pathname === '/data/earthquakes'}
                onClick={() => setIsOpen(false)}
              >
                <Globe className="h-4 w-4" />
              </NavLink>

              <NavLink 
                href="/data/weather" 
                label="Weather Alerts" 
                isActive={pathname === '/data/weather'}
                onClick={() => setIsOpen(false)}
              >
                <Activity className="h-4 w-4" />
              </NavLink>

              <NavLink 
                href="/data/satellite" 
                label="NASA Satellite" 
                isActive={pathname === '/data/satellite'}
                onClick={() => setIsOpen(false)}
              >
                <Radio className="h-4 w-4" />
              </NavLink>

              <NavLink 
                href="/data/health" 
                label="Health Data" 
                isActive={pathname === '/data/health'}
                onClick={() => setIsOpen(false)}
              >
                <Heart className="h-4 w-4" />
              </NavLink>
            </div>

            {/* Secondary Navigation */}
            <div className="mt-6 pt-4 border-t border-white/10 space-y-1">


              {/* Admin Section */}
              {(isAdmin || isCoordinator) && (
                <NavLink 
                  href="/admin" 
                  label="Admin Panel" 
                  isActive={pathname.startsWith('/admin')}
                  onClick={() => setIsOpen(false)}
                >
                  <Shield className="h-4 w-4" />
                </NavLink>
              )}

              {/* New Request Button */}
              <button
                onClick={() => setNewRequestModalOpen(true)}
                className="transition-all duration-200 w-full px-3 py-2 rounded-md flex items-center gap-2 text-xs font-medium bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30"
              >
                <Plus className="h-4 w-4" />
                <span>New Request</span>
              </button>

              {/* Search Button */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="transition-all duration-200 w-full px-3 py-2 rounded-md flex items-center gap-2 text-xs font-medium text-white/60 hover:bg-white/5 hover:text-white"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </button>
            </div>

            {/* Bottom Section */}
            <div className="mt-auto pb-4 pt-4 border-t border-white/10 space-y-1">
              {/* Settings */}
              <NavLink 
                href="/settings" 
                label="Settings" 
                isActive={pathname === '/settings'}
                onClick={() => setIsOpen(false)}
              >
                <Settings className="h-4 w-4" />
              </NavLink>

              {/* Profile/Account Section */}
              {user ? (
                <NavLink 
                  href="/profile" 
                  label="Profile" 
                  isActive={pathname === '/profile'}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="h-4 w-4 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </NavLink>
              ) : (
                <button
                  onClick={() => window.location.href = '/login'}
                  className="transition-all duration-200 w-full px-3 py-2 rounded-md flex items-center gap-2 text-xs font-medium bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Login</span>
                </button>
              )}

              {/* Logout */}
              {user && (
                <button
                  onClick={() => {
                    // Handle logout logic here
                    console.log('Logout clicked');
                  }}
                  className="transition-all duration-200 w-full px-3 py-2 rounded-md flex items-center gap-2 text-xs font-medium text-white/60 hover:bg-white/5 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onNotificationClick={(notification) => {
          if (notification.actionUrl) {
            window.location.href = notification.actionUrl;
          } else if (notification.metadata?.requestId) {
            window.location.href = `/requests/${notification.metadata.requestId}`;
          }
          markAsRead(notification.id);
        }}
      />

      {/* Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSearchModalOpen(false)}
          />
          <div className="relative w-full max-w-2xl glass rounded-2xl border border-white/10 p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Search className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Search</h2>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="ml-auto p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
              <input
                type="text"
                placeholder="Search for requests, users, or locations..."
                autoFocus
                className="w-full glass border border-white/10 rounded-lg pl-12 pr-4 py-3 text-foreground bg-transparent placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-3">Quick Links</p>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/requests"
                  onClick={() => setSearchModalOpen(false)}
                  className="p-3 glass border border-white/10 rounded-lg hover:bg-white/[0.05] transition-colors"
                >
                  <FileText className="h-5 w-5 text-primary mb-2" />
                  <p className="text-sm font-medium text-foreground">All Requests</p>
                </Link>
                <Link
                  href="/map"
                  onClick={() => setSearchModalOpen(false)}
                  className="p-3 glass border border-white/10 rounded-lg hover:bg-white/[0.05] transition-colors"
                >
                  <MapPin className="h-5 w-5 text-primary mb-2" />
                  <p className="text-sm font-medium text-foreground">Emergency Map</p>
                </Link>
                <Link
                  href="/analytics"
                  onClick={() => setSearchModalOpen(false)}
                  className="p-3 glass border border-white/10 rounded-lg hover:bg-white/[0.05] transition-colors"
                >
                  <BarChart3 className="h-5 w-5 text-primary mb-2" />
                  <p className="text-sm font-medium text-foreground">Analytics</p>
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setSearchModalOpen(false)}
                  className="p-3 glass border border-white/10 rounded-lg hover:bg-white/[0.05] transition-colors"
                >
                  <Users className="h-5 w-5 text-primary mb-2" />
                  <p className="text-sm font-medium text-foreground">User Management</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Request Modal */}
      {newRequestModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setNewRequestModalOpen(false)}
          />
          <div className="relative w-full max-w-md glass rounded-2xl border border-white/10 p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Plus className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">New Emergency Request</h2>
              <button
                onClick={() => setNewRequestModalOpen(false)}
                className="ml-auto p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-muted-foreground mb-6">
              Choose how you want to create a new emergency request:
            </p>
            
            <div className="space-y-3">
              <Link
                href="/requests/new"
                className="w-full p-4 glass border border-white/10 rounded-lg hover:bg-white/[0.05] transition-colors flex items-center gap-3 group"
              >
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Standard Request</p>
                  <p className="text-sm text-muted-foreground">Fill out a detailed form</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
              </Link>
              
              <button
                onClick={() => {
                  setNewRequestModalOpen(false);
                  // Could open a quick request modal here
                }}
                className="w-full p-4 glass border border-white/10 rounded-lg hover:bg-white/[0.05] transition-colors flex items-center gap-3 group text-left"
              >
                <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 group-hover:bg-orange-500/20">
                  <Zap className="h-5 w-5 text-orange-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Quick Alert</p>
                  <p className="text-sm text-muted-foreground">For urgent situations</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}