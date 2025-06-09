import useDashboardStats from "../../hooks/UseDashboardStats";
import MetricCard from "../../components/MetricCard";
import UpcomingAppointments from "../../components/UpcomingAppointments";
import DashboardChart from "../../components/DashboardChart";
import QuickActions from "../../components/QuickActions";
import PageHeader from "../../components/PageHeader";

export default function Dashboard() {
  const { appointments, clients, revenue, staff, upcoming } =
    useDashboardStats();
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Appointments" value="14" type="appointments" />
        <MetricCard title="Clients" value="26" type="clients" />
        <MetricCard title="Revenue" value="$1,240" type="revenue" />
        <MetricCard title="Staff" value="4" type="staff" />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Upcoming Appointments */}
      <UpcomingAppointments appointments={upcoming} />

      {/* Chart Section */}
      <DashboardChart />
    </div>
  );
}
