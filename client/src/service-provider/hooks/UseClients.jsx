const mockClients = [
  {
    id: "cl123",
    name: "Sarah Johnson",
    contact: { phone: "+1234567890", email: "sarah@example.com" },
    stats: {
      totalAppointments: 14,
      missed: 2,
      totalSpent: 1240,
      lastVisit: "2025-05-20",
    },
    notes: "Prefers morning appointments",
  },
  {
    id: "cl124",
    name: "Sarah Johnson",
    contact: { phone: "+1234567890", email: "sarah@example.com" },
    stats: {
      totalAppointments: 14,
      missed: 2,
      totalSpent: 1240,
      lastVisit: "2025-05-20",
    },
    notes: "Prefers morning appointments",
  },
  {
    id: "cl125",
    name: "Sarah Johnson",
    contact: { phone: "+1234567890", email: "sarah@example.com" },
    stats: {
      totalAppointments: 14,
      missed: 2,
      totalSpent: 1240,
      lastVisit: "2025-05-20",
    },
    notes: "Prefers morning appointments",
  },
  {
    id: "cl126",
    name: "Sarah Johnson",
    contact: { phone: "+1234567890", email: "sarah@example.com" },
    stats: {
      totalAppointments: 14,
      missed: 2,
      totalSpent: 1240,
      lastVisit: "2025-05-20",
    },
    notes: "Prefers morning appointments",
  },
  {
    id: "cl127",
    name: "Sarah Johnson",
    contact: { phone: "+1234567890", email: "sarah@example.com" },
    stats: {
      totalAppointments: 14,
      missed: 2,
      totalSpent: 1240,
      lastVisit: "2025-05-20",
    },
    notes: "Prefers morning appointments",
  },
  // ...more clients
];

export function useClients() {
  return mockClients;
}

export function useClient(id) {
  return mockClients.find((apt) => apt.id === id);
}
