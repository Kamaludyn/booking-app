const mockMethods = [
  {
    id: 1,
    name: "Stripe",
    type: "stripe",
    enabled: true,
    details: {
      publishableKey: "pk_test_1234567890abcdef",
      secretKey: "sk_test_abcdef1234567890",
    },
  },
  {
    id: 2,
    name: "PayPal",
    type: "paypal",
    enabled: true,
    details: {
      email: "business@example.com",
    },
  },
  {
    id: 3,
    name: "Bank Transfer",
    type: "bank_transfer",
    enabled: false,
    details: {
      accountName: "John Doe",
      accountNumber: "1234567890",
      bankName: "Example Bank",
    },
  },
  {
    id: 4,
    name: "Mobile Money",
    type: "mobile_money",
    enabled: true,
    details: {
      phoneNumber: "+233501234567",
      provider: "MTN",
    },
  },
];
export function useMethods() {
  return mockMethods;
}
