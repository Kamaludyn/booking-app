const mockStaff = [
  {
    id: "1",
    name: "Samantha Lee",
    role: "Hair Stylist",
    phone: "+1 555-5678",
    email: "samantha@example.com",
  },
  {
    id: "2",
    name: "James Tucker",
    role: "Massage Therapist",
    phone: "+1 555-5678",
    email: "james@example.com",
  },
];

export function useStaff() {
  return mockStaff;
}
export function useStaffId(id) {
  return mockStaff.find((member) => member.id === id);
}
