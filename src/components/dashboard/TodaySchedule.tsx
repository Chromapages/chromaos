'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

const schedule = [
  { time: '08:00 AM', title: 'Cardiology Review', description: 'Focus on heart failure symptoms.', type: 'study' },
  { time: '10:30 AM', title: 'QBank Session', description: '50 questions on Neurology.', type: 'exam' },
  { time: '01:00 PM', title: 'Lunch Break', description: 'Rest and recharge.', type: 'break' },
  { time: '02:30 PM', title: 'Anatomy Lab', description: 'Lower limb review.', type: 'study' },
  { time: '05:00 PM', title: 'Community Sync', description: 'Weekly group discussion.', type: 'sync' },
];

export function TodaySchedule() {
  return (
    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-black/5 h-full">
      <h3 className="text-2xl font-black italic tracking-tight uppercase mb-8">Today's Schedule</h3>
      
      <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-muted before:z-0">
        {schedule.map((item) => (
          <div key={item.time} className="flex gap-6 relative z-10">
            <div className={cn(
              "w-6 h-6 rounded-full border-4 border-white shrink-0 shadow-sm",
              item.type === 'study' ? "bg-primary" : 
              item.type === 'exam' ? "bg-rose-500" :
              item.type === 'sync' ? "bg-blue-500" : "bg-muted-foreground/30"
            )} />
            
            <div className="flex-1 -mt-1">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">{item.time}</span>
              </div>
              <h4 className="text-[17px] font-black tracking-tight">{item.title}</h4>
              <p className="text-sm font-bold text-muted-foreground/70">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-10 pt-8 border-t border-muted/50">
        <div className="p-6 rounded-3xl bg-muted/20 flex flex-col items-center text-center">
          <p className="text-sm font-bold text-muted-foreground mb-4">You have 2 items remaining for today.</p>
          <button className="text-xs font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors">
            View All Tasks
          </button>
        </div>
      </div>
    </div>
  );
}
