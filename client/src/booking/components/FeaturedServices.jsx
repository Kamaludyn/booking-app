import { Link } from "react-router-dom";
import { Scissors, ContactRound, Gem } from "lucide-react";

const services = [
  {
    id: 1,
    name: "Hair Styling",
    description: "Professional haircut and styling session",
    icon: <Scissors className="w-6 h-6" />,
  },
  {
    id: 2,
    name: "Spa Treatment",
    description: "Relaxing full-body massage and facial",
    icon: <ContactRound className="w-6 h-6" />,
  },
  {
    id: 3,
    name: "Nail Care",
    description: "Manicure, pedicure, and nail art services",
    icon: <Gem className="w-6 h-6" />,
  },
];
const FeaturedServices = () => {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <h2 className="text-3xl font-bold mb-12 text-center">
        <span className="relative inline-block">
          <span className="relative z-10">Popular Services</span>
          <span className="absolute bottom-0 left-0 w-full h-2 bg-accent-3 dark:bg-accent-3/30 -rotate-1"></span>
        </span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white dark:bg-surface-3 p-6 rounded-xl border border-transparent hover:border-primary-400 dark:hover:border-primary-2 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
          >
            <div className="text-4xl mb-4 transition-transform duration-300">
              {service.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-2 transition-colors duration-300">
              {service.name}
            </h3>
            <p className="text-text-600 dark:text-text-400 mb-4">
              {service.description}
            </p>
            <Link
              to={`/booking/${service.id}`}
              className="inline-flex items-center text-primary-2 font-medium hover:underline"
            >
              Learn more
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedServices;
