export default function useDashboardStats() {
  return {
    appointments: 14,
    clients: 26,
    revenue: 1240,
    staff: 4,
    upcoming: [
      {
        id: 1,
        name: "Sarah Johnson",
        time: "Today · 3:00 PM",
        service: "Therapy Session",
      },
      {
        id: 2,
        name: "Mark Lee",
        time: "Tomorrow · 11:00 AM",
        service: "Consultation",
      },
    ],
  };
}
