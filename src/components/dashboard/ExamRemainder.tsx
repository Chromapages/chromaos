'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, ChevronRight } from 'lucide-react';

const dates = [
  { day: 'MON', date: 7, active: true },
  { day: 'TUE', date: 8, active: false },
  { day: 'WED', date: 9, active: false },
  { day: 'THU', date: 10, active: false },
  { day: 'FRI', date: 11, active: false },
  { day: 'SAT', date: 12, active: false },
  { day: 'SUN', date: 13, active: false },
];

export function ExamRemainder() {
  return (
    <div className="bg-sidebar rounded-[2.5rem] p-10 shadow-2xl border border-white/5 h-full text-sidebar-foreground relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-5 transform rotate-12 group-hover:rotate-0 transition-transform duration-700">
        <CalendarIcon size={120} />
      </div>

      <div className="flex items-center justify-between mb-10 relative z-10">
        <div>
          <h3 className="text-2xl font-black italic tracking-tight uppercase">Exam Remainder</h3>
          <p className="text-sidebar-foreground/50 font-bold text-sm">Countdown to Step 1 Exam</p>
        </div>
        <div className="p-3 bg-primary rounded-2xl text-primary-foreground font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20">
          24 Days Left
        </div>
      </div>
      
      <div className="flex justify-between gap-2 relative z-10">
        {dates.map((item) => (
          <div 
            key={item.date} 
            className={cn(
              "flex flex-col items-center gap-2 flex-1 py-4 rounded-3xl transition-all duration-300 cursor-pointer",
              item.active 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
                : "bg-white/5 hover:bg-white/10"
            )}
          >
            <span className="text-[10px] font-black tracking-widest uppercase opacity-70">{item.day}</span>
            <span className="text-xl font-black">{item.date}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-10 relative z-10">
        <button className="w-full flex items-center justify-between bg-white text-sidebar p-5 rounded-[1.75rem] font-black text-xs uppercase tracking-widest hover:bg-white/90 transition-all group/btn">
          View Detail Schedule
          <ChevronRight className="h-5 w-5 transform group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
