import { Scissors, ContactRound, Gem } from "lucide-react";

const allServices = [
  {
    id: 1,
    name: "Hair Styling",
    description:
      "Professional haircut and styling session with our expert stylists. Includes shampoo, cut, blow-dry, and finishing products for that perfect look.",
    category: "Beauty",
    price: 45,
    requireDeposit: true,
    duration: "45 min",
    rating: 4.8,
    reviewCount: 124,
    location: "Downtown Salon",
    address: "123 Beauty St, Downtown",
    provider: "Sarah Johnson",
    providerBio:
      "Licensed cosmetologist with 8 years experience specializing in modern cuts and color.",
    icon: <Scissors className="w-6 h-6" />,
    availability: ["Mon-Fri: 9AM-7PM", "Sat: 10AM-5PM"],
  },
  {
    id: 2,
    name: "Spa Treatment",
    description:
      "Premium full-body relaxation experience including deep tissue massage, aromatherapy, and rejuvenating facial. Uses organic products for complete skin nourishment.",
    category: "Wellness",
    price: 85,
    requireDeposit: true,
    duration: "60 min",
    rating: 4.9,
    reviewCount: 98,
    location: "Westside Wellness Center",
    address: "456 Serenity Ave, Westside",
    provider: "Michael Chen",
    providerBio:
      "Certified massage therapist with 10 years experience in holistic healing techniques.",
    icon: <ContactRound className="w-6 h-6" />,
    availability: ["Tue-Sun: 10AM-8PM", "Closed Mondays"],
  },
  {
    id: 3,
    name: "Nail Care",
    description:
      "Comprehensive nail services including manicure, pedicure, cuticle care, and custom nail art. We use premium polishes and sanitized tools for your safety.",
    category: "Beauty",
    price: 35,
    requireDeposit: true,
    duration: "30 min",
    rating: 4.7,
    reviewCount: 87,
    location: "Midtown Nail Studio",
    address: "789 Polish Blvd, Midtown",
    provider: "Lisa Rodriguez",
    providerBio:
      "Nail technician specialist with 6 years experience creating beautiful, long-lasting nail designs.",
    icon: <Gem className="w-6 h-6" />,
    availability: ["Mon-Sat: 8AM-8PM", "Sun: 10AM-4PM"],
  },
  {
    id: 4,
    name: "Beard Trim",
    description:
      "Precision beard grooming service including trimming, shaping, hot towel treatment, and conditioning. Perfect for maintaining your signature look.",
    category: "Grooming",
    price: 25,
    requireDeposit: true,
    duration: "30 min",
    rating: 4.6,
    reviewCount: 112,
    location: "Downtown Barber Shop",
    address: "321 Grooming Lane, Downtown",
    provider: "James Wilson",
    providerBio:
      "Master barber with 12 years experience in men's grooming and classic barbering techniques.",
    icon: <Scissors className="w-6 h-6" />,
    availability: ["Mon-Fri: 8AM-6PM", "Sat: 9AM-4PM", "Closed Sundays"],
  },
];

export function useServices() {
  return allServices;
}

export function useService(id) {
  return allServices.find((service) => service.id === parseInt(id));
}
