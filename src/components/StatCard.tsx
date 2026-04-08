import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className
}: StatCardProps) {
  return (
    <div className={cn(
      "p-8 rounded-[2rem] bg-card border border-border/50 text-card-foreground shadow-sm transition-all hover:scale-[1.02] duration-300",
      className
    )}>
      <div className="flex items-center justify-between mb-6">
        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <div className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase",
            trend.positive ? "bg-emerald-100/50 text-emerald-600" : "bg-rose-100/50 text-rose-600"
          )}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </div>
        )}
      </div>
      <div>
        <div className="text-4xl font-black tracking-tighter mb-1">{value}</div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-foreground/80 lowercase italic">{title}</h3>
          {description && (
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-none">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
