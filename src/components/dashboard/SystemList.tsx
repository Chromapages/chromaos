'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle } from 'lucide-react';

const systems = [
  { name: 'Cardiology', status: 'pass', progress: 85 },
  { name: 'Respiratory', status: 'pass', progress: 72 },
  { name: 'Neurology', status: 'fail', progress: 45 },
  { name: 'Urology', status: 'pass', progress: 68 },
  { name: 'Hematology', status: 'pass', progress: 91 },
  { name: 'Immunology', status: 'fail', progress: 38 },
];

export function SystemList() {
  return (
    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-black/5">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-black italic tracking-tight uppercase">All System List</h3>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-12 text-xs font-black text-muted-foreground uppercase tracking-widest px-4">
          <div className="col-span-1">No</div>
          <div className="col-span-5 text-center">System Name</div>
          <div className="col-span-2 text-center">Pass/Fail</div>
          <div className="col-span-4 text-center">Progress</div>
        </div>
        
        {systems.map((system, i) => (
          <div key={system.name} className="grid grid-cols-12 items-center bg-muted/20 hover:bg-muted/40 transition-colors p-4 rounded-3xl group">
            <div className="col-span-1 text-sm font-black text-muted-foreground/50">
              {String(i + 1).padStart(2, '0')}
            </div>
            
            <div className="col-span-5 text-center">
              <span className="text-lg font-bold group-hover:text-primary transition-colors">{system.name}</span>
            </div>
            
            <div className="col-span-2 flex justify-center">
              {system.status === 'pass' ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-500 fill-emerald-50 opacity-100" />
              ) : (
                <XCircle className="h-6 w-6 text-rose-500 fill-rose-50 opacity-100" />
              )}
            </div>
            
            <div className="col-span-4 flex items-center gap-4 px-4">
              <div className="flex-1 h-3 bg-white rounded-full overflow-hidden shadow-inner">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-1000",
                    system.status === 'pass' ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                  style={{ width: `${system.progress}%` }}
                />
              </div>
              <span className="text-sm font-black w-8">{system.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
