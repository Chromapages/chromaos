import React from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SystemList } from '@/components/dashboard/SystemList';
import { PerformanceDonut } from '@/components/dashboard/PerformanceDonut';
import { RankingGauge } from '@/components/dashboard/RankingGauge';
import { TodaySchedule } from '@/components/dashboard/TodaySchedule';
import { ExamRemainder } from '@/components/dashboard/ExamRemainder';

export default function DashboardPage() {
  return (
    <div className="p-10 space-y-12 max-w-[1800px] mx-auto w-full h-full overflow-y-auto custom-scrollbar">
      <DashboardHeader />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column - All System List */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          <SystemList />
          <div className="mt-auto pt-6">
            <ExamRemainder />
          </div>
        </div>

        {/* Right Column - Performance & Schedule */}
        <div className="lg:col-span-4 flex flex-col gap-10">
          <div className="grid grid-cols-1 gap-10">
            <PerformanceDonut />
            <RankingGauge />
            <TodaySchedule />
          </div>
        </div>
      </div>
    </div>
  );
}
