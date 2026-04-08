'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Settings2, PlayCircle } from 'lucide-react';

export function DashboardHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
      <div>
        <h1 className="text-5xl font-black tracking-tight mb-2">Welcome Sarah!</h1>
        <p className="text-muted-foreground font-bold text-lg">Let's see what we are doing today!</p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold border-2 hover:bg-muted/50">
          <Settings2 className="mr-2 h-5 w-5" />
          Custom
        </Button>
        <Button className="rounded-2xl h-12 px-6 font-black bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl transition-all border-none">
          <Sparkles className="mr-2 h-5 w-5 fill-current" />
          AI Mode
        </Button>
        <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold border-2 hover:bg-muted/50">
          <PlayCircle className="mr-2 h-5 w-5" />
          Tutorial
        </Button>
      </div>
    </div>
  );
}
