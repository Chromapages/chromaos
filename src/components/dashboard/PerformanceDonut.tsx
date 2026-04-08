'use client';

import React from 'react';

const data = [
  { name: 'Cardiology', value: 85, color: '#10B981' },
  { name: 'Respiratory', value: 72, color: '#3B82F6' },
  { name: 'Neurology', value: 45, color: '#F59E0B' },
  { name: 'Urology', value: 68, color: '#8B5CF6' },
  { name: 'Hematology', value: 91, color: '#EC4899' },
];

export function PerformanceDonut() {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  const size = 300;
  const strokeWidth = 50;
  const radius = (size / 2) - (strokeWidth / 2);
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativeValue = 0;

  return (
    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-black/5 flex flex-col items-center">
      <h3 className="text-2xl font-black italic tracking-tight uppercase mb-8 self-start">Performance</h3>
      
      <div className="relative w-[300px] h-[300px] flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -1 * (cumulativeValue / total) * circumference;
            cumulativeValue += item.value;

            return (
              <circle
                key={item.name}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="butt"
                className="transition-all duration-1000 hover:opacity-80 cursor-pointer"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-4xl font-black">82%</span>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Average</span>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 w-full">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-sm font-bold text-muted-foreground truncate">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
