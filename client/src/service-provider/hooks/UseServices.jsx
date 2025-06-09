const mockServices = [
  {
    id: "1",
    name: "1-Hour Coaching Call",
    description: "A private 1-on-1 coaching session.",
    duration: 60,
    requireDeposit: true,
    price: 120,
  },
  {
    id: "2",
    name: "30-Minute Haircut",
    description: "Quick and clean haircut appointment.",
    duration: 30,
    requireDeposit: true,
    price: 40,
  },
  {
    id: "3",
    name: "Free Initial Consultation",
    description: "Discuss your needs and goals.",
    duration: 20,
    requireDeposit: false,
    price: 0,
  },
  {
    id: "4",
    name: "Yoga Session",
    description: "1-hour private yoga session.",
    duration: 60,
    requireDeposit: true,
    price: 80,
  },
];

export function useServices() {
  return mockServices;
}

export function useService(id) {
  return mockServices.find((service) => service.id === id);
}
