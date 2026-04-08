'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home,
  BookOpen, 
  FileEdit, 
  CirclePlay, 
  Activity, 
  Calendar,
  Users,
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/materials', label: 'Study Materials', icon: BookOpen },
  { href: '/notes', label: 'Notes', icon: FileEdit },
  { href: '/test-bank', label: 'Test Bank', icon: CirclePlay },
  { href: '/performance', label: 'Performance', icon: Activity },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/community', label: 'Community', icon: Users },
];

import { useAuth } from './auth/AuthProvider';

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { logout } = useAuth();

  return (
    <div className={cn(
      "relative flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
      isCollapsed ? "w-20" : "w-72"
    )}>
      <div className="flex items-center justify-between p-8 mb-4">
        {!isCollapsed && (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
              <span className="text-primary-foreground font-black text-xl">M</span>
            </div>
            <span className="text-2xl font-black tracking-tight text-sidebar-foreground truncate">MedOS</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon-sm" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn("text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground", !isCollapsed && "ml-auto")}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 px-4 space-y-2 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-5 py-4 rounded-3xl text-[15px] font-bold transition-all duration-300 group",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/30 scale-[1.02] border-none"
                  : "text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className={cn("shrink-0 transition-transform duration-300 group-hover:scale-110", isCollapsed ? "h-6 w-6" : "h-5 w-5")} />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade Pro Card - Medical Style */}
      {!isCollapsed && (
        <div className="px-5 py-6">
          <div className="p-6 rounded-[2.25rem] bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 relative overflow-hidden group/upgrade">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full blur-2xl group-hover/upgrade:bg-primary/20 transition-all" />
            
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-primary rounded-xl">
                 <Zap className="h-4 w-4 text-primary-foreground fill-current" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-primary">Upgrade Pro</span>
            </div>
            
            <p className="text-[13px] font-bold text-sidebar-foreground/70 mb-5 leading-snug">
              Get unlimited access to all system banks and AI tutor.
            </p>
            
            <Button className="w-full rounded-2xl bg-sidebar-foreground text-sidebar bg-white hover:bg-white/90 font-black text-xs uppercase tracking-widest h-11">
              Go Premium
            </Button>
          </div>
        </div>
      )}

      <div className="p-4 border-t border-sidebar-border space-y-1">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-4 px-5 py-3 rounded-2xl text-[14px] font-bold text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-200",
            pathname.startsWith('/settings') && "bg-sidebar-accent text-sidebar-foreground"
          )}
        >
          <Settings className={cn("shrink-0", isCollapsed ? "h-6 w-6" : "h-5 w-5")} />
          {!isCollapsed && <span>Settings</span>}
        </Link>
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-[14px] font-bold text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-rose-400 transition-all duration-200"
        >
          <LogOut className={cn("shrink-0", isCollapsed ? "h-6 w-6" : "h-5 w-5")} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
