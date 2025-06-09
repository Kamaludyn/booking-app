import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", revenue: 400 },
  { name: "Feb", revenue: 800 },
  { name: "Mar", revenue: 600 },
  { name: "Apr", revenue: 1200 },
  { name: "May", revenue: 900 },
];

export default function DashboardChart() {
  return (
    <div className="bg-surface-500 dark:bg-surface-800 p-4 rounded-xl border border-border-500 dark:border-border-800 shadow-sm hover:shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-text-500 dark:text-white">
        Revenue Trends
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
          <XAxis dataKey="name" stroke="var(--color-text-400)" />
          <YAxis stroke="var(--color-text-400)" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#4a53f3"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
