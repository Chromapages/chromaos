'use client';

import React from 'react';

export function RankingGauge() {
  const percentage = 92;
  const size = 280;
  const strokeWidth = 30;
  const radius = (size / 2) - 40;
  const center = size / 2;
  
  // Half circumference for gauge
  const circumference = Math.PI * radius;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

  return (
    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-black/5 flex flex-col items-center justify-between h-full">
      <h3 className="text-2xl font-black italic tracking-tight uppercase self-start mb-6">Ranking Percentile</h3>
      
      <div className="relative flex items-center justify-center pt-8">
        <svg width={size} height={size / 1.5} className="overflow-visible">
          {/* Background Background Shadow */}
          <path
            d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Foreground */}
          <path
            d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
            fill="transparent"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
          <span className="text-6xl font-black">{percentage}%</span>
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-2">Top Talent</span>
        </div>
      </div>

      <div className="mt-8 text-center bg-primary/10 px-6 py-4 rounded-3xl border border-primary/20">
        <p className="text-sm font-bold text-primary">You are doing better than 92% of students this week!</p>
      </div>
    </div>
  );
}
