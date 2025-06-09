const mockAppointments = [
  {
    id: "apt-123",
    client: "John Doe",
    service: "Haircut",
    time: "2025-05-20T10:00:00Z",
    status: "missed",
    paymentStatus: "partial",
    servicePrice: 100,
    payments: [
      {
        id: "pay-001",
        method: "online",
        amount: 25,
        balance: 75,
        percentage: 25,
        date: "2025-05-18T09:00:00Z",
        note: "", // Optional for offline manual payments
      },
    ],
  },
  {
    id: "apt-132",
    client: "Jane Doe",
    service: "Haircut",
    time: "2025-05-20T10:00:00Z",
    status: "upcoming",
    paymentStatus: "paid",
    servicePrice: 110,
    payments: [
      {
        id: "pay-004",
        method: "offline",
        amount: 110,
        balance: 0,
        percentage: 100,
        date: "2025-05-18T09:00:00Z",
        note: "", // Optional for offline manual payments
      },
    ],
  },
  {
    id: "apt-122",
    client: "Peter Bulama",
    service: "Haircut",
    time: "2025-05-20T10:00:00Z",
    status: "cancelled",
    paymentStatus: "partial",
    servicePrice: 200,
    payments: [
      {
        id: "pay-004",
        method: "online",
        amount: 100,
        balance: 100,
        percentage: 50,
        date: "2025-05-18T09:00:00Z",
        note: "", // Optional for offline manual payments
      },
    ],
  },
  {
    id: "apt-121",
    client: "John Doe",
    service: "Haircut",
    time: "2025-05-20T10:00:00Z",
    status: "upcoming",
    paymentStatus: "partial",
    servicePrice: 150,
    payments: [
      {
        id: "pay-005",
        method: "online",
        amount: 100,
        balance: 50,
        percentage: 75,
        date: "2025-05-18T09:00:00Z",
        note: "", // Optional for offline manual payments
      },
    ],
  },
  {
    id: "apt-113",
    client: "Abdulrasheed Ibrahim",
    service: "Haircut",
    time: "2025-05-20T10:00:00Z",
    status: "completed",
    paymentStatus: "paid",
    servicePrice: 100,
    payments: [
      {
        id: "pay-006",
        method: "online",
        amount: 25,
        balance: 75,
        percentage: 25,
        date: "2025-05-18T09:00:00Z",
        note: "", // Optional for offline manual payments
      },
    ],
  },
];

export function useAppointments() {
  return mockAppointments;
}

export function useAppointment(id) {
  return mockAppointments.find((apt) => apt.id === id);
}
