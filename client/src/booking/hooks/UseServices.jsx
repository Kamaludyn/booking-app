import { Scissors, ContactRound, Gem } from "lucide-react";

const allServices = [
  {
    id: 1,
    name: "Hair Styling",
    description:
      "Professional haircut and styling session with our expert stylists. Includes shampoo, cut, blow-dry, and finishing products for that perfect look.",
    category: "Beauty",
    price: 45,
    duration: "45 min",
    rating: 4.8,
    reviewCount: 124,
    location: "Downtown Salon",
    address: "123 Beauty St, Downtown",
    provider: "Sarah Johnson",
    providerBio:
      "Licensed cosmetologist with 8 years experience specializing in modern cuts and color.",
    icon: <Scissors className="w-6 h-6" />,
    images: [
      "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    ],
    availability: ["Mon-Fri: 9AM-7PM", "Sat: 10AM-5PM"],
  },
  {
    id: 2,
    name: "Spa Treatment",
    description:
      "Premium full-body relaxation experience including deep tissue massage, aromatherapy, and rejuvenating facial. Uses organic products for complete skin nourishment.",
    category: "Wellness",
    price: 85,
    duration: "60 min",
    rating: 4.9,
    reviewCount: 98,
    location: "Westside Wellness Center",
    address: "456 Serenity Ave, Westside",
    provider: "Michael Chen",
    providerBio:
      "Certified massage therapist with 10 years experience in holistic healing techniques.",
    icon: <ContactRound className="w-6 h-6" />,
    images: [
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1540202404-1b927e27fa8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    ],
    availability: ["Tue-Sun: 10AM-8PM", "Closed Mondays"],
  },
  {
    id: 3,
    name: "Nail Care",
    description:
      "Comprehensive nail services including manicure, pedicure, cuticle care, and custom nail art. We use premium polishes and sanitized tools for your safety.",
    category: "Beauty",
    price: 35,
    duration: "30 min",
    rating: 4.7,
    reviewCount: 87,
    location: "Midtown Nail Studio",
    address: "789 Polish Blvd, Midtown",
    provider: "Lisa Rodriguez",
    providerBio:
      "Nail technician specialist with 6 years experience creating beautiful, long-lasting nail designs.",
    icon: <Gem className="w-6 h-6" />,
    images: [
      "https://images.unsplash.com/photo-1596704017256-d7c6fd0f4e87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    ],
    availability: ["Mon-Sat: 8AM-8PM", "Sun: 10AM-4PM"],
  },
  {
    id: 4,
    name: "Beard Trim",
    description:
      "Precision beard grooming service including trimming, shaping, hot towel treatment, and conditioning. Perfect for maintaining your signature look.",
    category: "Grooming",
    price: 25,
    duration: "30 min",
    rating: 4.6,
    reviewCount: 112,
    location: "Downtown Barber Shop",
    address: "321 Grooming Lane, Downtown",
    provider: "James Wilson",
    providerBio:
      "Master barber with 12 years experience in men's grooming and classic barbering techniques.",
    icon: <Scissors className="w-6 h-6" />,
    images: [
      "https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    ],
    availability: ["Mon-Fri: 8AM-6PM", "Sat: 9AM-4PM", "Closed Sundays"],
  },
];

export function useServices() {
  return allServices;
}

export function useService(id) {
  return allServices.find((service) => service.id === parseInt(id));
}
