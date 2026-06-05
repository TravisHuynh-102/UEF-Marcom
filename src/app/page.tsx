'use client';

import AIChiefOfStaff from '@/components/dashboard/ai-chief-of-staff';
import MetricCards from '@/components/dashboard/metric-cards';
import ProjectsList from '@/components/dashboard/projects-list';
import TasksList from '@/components/dashboard/tasks-list';
import WorkloadChart from '@/components/dashboard/workload-chart';
import AISummaryFeed from '@/components/dashboard/ai-summary-feed';

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-8">
      {/* AI Chief of Staff — Hero Section */}
      <section id="ai-chief-of-staff">
        <AIChiefOfStaff />
      </section>

      {/* Key Metrics Cards */}
      <section id="key-metrics">
        <MetricCards />
      </section>

      {/* Main Content: Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column — Operations (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <section id="active-projects">
            <ProjectsList />
          </section>
          <section id="tasks-today">
            <TasksList />
          </section>
        </div>

        {/* Right Column — AI Analytics & Workload (1/3) */}
        <div className="space-y-6">
          <section id="team-workload">
            <WorkloadChart />
          </section>
          <section id="ai-feed">
            <AISummaryFeed />
          </section>
        </div>
      </div>
    </div>
  );
}
