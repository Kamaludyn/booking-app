import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Scissors,
  ContactRound,
  Gem,
  Clock,
  Star,
  MapPin,
  ChevronLeft,
} from "lucide-react";
import { useServices } from "../../hooks/UseServices";

export default function ServiceListing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const services = useServices();

  const navigate = useNavigate();

  // Get unique categories
  const categories = [
    "All",
    ...new Set(services.map((service) => service.category)),
  ];

  // Filter services based on search and filters
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || service.category === selectedCategory;
    const matchesPrice =
      service.price >= priceRange[0] && service.price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <section className="container mx-auto px-4 pb-12 md:pb-16">
      <div className="relative w-full flex items-center justify-center">
        <Link
          to="/"
          className="absolute top-0 left-0 justify-self-start flex items-center p-2 rounded-lg bg-primary-2/10 text-primary-2 mb-4"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
        </Link>
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="relative inline-block">
              <span className="relative z-10">Our Services</span>
              <span className="absolute bottom-0 left-0 w-full h-2 bg-accent-3 dark:bg-accent-3/30 -rotate-1"></span>
            </span>
          </h1>
          <p className="text-lg text-text-600 dark:text-text-400 max-w-2xl mx-auto">
            Browse and book from our wide range of professional services
          </p>
        </div>
      </div>
      <div className="mb-6 bg-white dark:bg-surface-3 p-4 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-400" />
            <input
              type="text"
              placeholder="Search services..."
              className="w-full pl-10 pr-4 py-2 border border-border-800/20 dark:border-text-400 rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-primary-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-400" />
            <select
              className="appearance-none pl-10 pr-8 py-2 border border-border-800/20 outline-transparent dark:border-text-400 rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-primary-2 bg-white dark:bg-surface-3"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">
            Price Range: ${priceRange[0]} - ${priceRange[1]}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], parseInt(e.target.value)])
            }
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white dark:bg-surface-3 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-50 border border-transparent hover:border-primary-400 dark:hover:border-primary-2"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary-2/10 text-primary-2">
                  {service.icon}
                </div>
                <h3
                  className="text-xl font-semibold cursor-pointer"
                  onClick={() => navigate(`/booking/${service.id}`)}
                >
                  {service.name}
                </h3>
              </div>

              <p className="text-text-600 dark:text-text-400 mb-4 line-clamp-2">
                {service.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="flex items-center text-sm bg-surface-2 dark:bg-surface-4 px-2 py-1 rounded">
                  <Clock className="w-3 h-3 mr-1" /> {service.duration}
                </span>
                <span className="flex items-center text-sm bg-surface-2 dark:bg-surface-4 px-2 py-1 rounded">
                  <MapPin className="w-3 h-3 mr-1" /> {service.location}
                </span>
                <span className="flex items-center text-sm bg-surface-2 dark:bg-surface-4 px-2 py-1 rounded">
                  <Star className="w-3 h-3 mr-1 text-yellow-500 fill-yellow-500" />{" "}
                  {service.rating}
                </span>
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className="text-xl font-bold text-primary-2">
                  ${service.price}
                </span>
                <Link
                  to={`/booking/${service.id}`}
                  className="px-4 py-2 bg-primary-2 text-white rounded-lg hover:bg-primary-2/90 transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <Search className="mx-auto w-12 h-12 text-text-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">No services found</h3>
          <p className="text-text-500 mb-4">
            Try adjusting your search or filters
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
              setPriceRange([0, 100]);
            }}
            className="px-4 py-2 text-primary-2 border border-primary-2 rounded-lg hover:bg-primary-2/10 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}
