import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  Clock,
  Star,
  MapPin,
  User,
  Calendar,
  Phone,
  Mail,
  Check,
  Lock,
} from "lucide-react";
import { useService } from "../../hooks/UseServices";

export default function ServiceListingDetails() {
  const { id } = useParams();
  const service = useService(id);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showFullForm, setShowFullForm] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("service", service);
    console.log("serviceId", id);
  }, []);

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Service not found</h2>
        <Link to="/book-services" className="text-primary-2 hover:underline">
          ← Back to services
        </Link>
      </div>
    );
  }

  const availableTimes = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
  ];

  return (
    <section className="relative container mx-auto px-4 pb-8 md:pb-12">
      <div className="relative w-full flex items-center justify-center">
        <Link
          to={-1}
          className="absolute top-0 left-0 justify-self-start flex items-center p-2 rounded-lg bg-primary-2/10 text-primary-2 mb-4"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
        </Link>
        <h1 className="text-center text-3xl md:text-4xl font-bold mb-4">
          <span className="relative inline-block">
            <span className="relative z-10">Service Details</span>
            <span className="absolute bottom-0 left-0 w-full h-2 bg-accent-3 dark:bg-accent-3/30 -rotate-1"></span>
          </span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2 md:pt-4">
        <div>
          <div className="bg-white dark:bg-surface-3 p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary-2/10 text-primary-2">
                {service.icon}
              </div>
              <h1 className="text-2xl font-bold">{service.name}</h1>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <span className="flex items-center text-yellow-600">
                <Star className="w-4 h-4 fill-yellow-500 mr-1" />
                {service.rating} ({service.reviewCount} reviews)
              </span>
              <span className="flex items-center text-text-500">
                <Clock className="w-4 h-4 mr-1" /> {service.duration}
              </span>
              <span className="flex items-center text-text-500">
                <MapPin className="w-4 h-4 mr-1" /> {service.location}
              </span>
            </div>

            <p className="text-lg text-text-600 dark:text-text-400 mb-6">
              {service.description}
            </p>

            <div className="border-t border-border-800/20 dark:border-text-400 pt-6 mb-6">
              <h3 className="font-semibold mb-3 flex items-center">
                <User className="w-5 h-5 mr-2" /> About the Provider
              </h3>
              <p className="text-text-600 dark:text-text-400 mb-2">
                <span className="font-medium">{service.provider}</span> -{" "}
                {service.providerBio}
              </p>
              <div className="flex items-center gap-4 text-sm mt-3">
                <span className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" /> (555) 123-4567
                </span>
                <span className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" /> contact@example.com
                </span>
              </div>
            </div>

            <div className="border-t border-border-800/20 dark:border-text-400 pt-6">
              <h3 className="font-semibold mb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2" /> Availability
              </h3>
              <ul className="list-disc pl-5 text-text-600 dark:text-text-400">
                {service.availability.map((slot, i) => (
                  <li key={i}>{slot}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-3 p-6 rounded-xl shadow-sm h-fit sticky top-6">
          <h2 className="text-xl font-bold mb-6">Book Appointment</h2>

          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-border-800/20 dark:border-text-400">
              <span className="font-medium">Service Price:</span>
              <span className="text-2xl font-bold text-primary-2">
                ${service.price}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Date
                </label>
                <input
                  type="date"
                  className="w-full p-2 border border-border-800/20 dark:border-text-400 dark:outline-transparent rounded-lg"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Available Times
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        className={`py-2 px-3 rounded-lg border ${
                          selectedTime === time
                            ? "bg-primary-2 text-white border-primary-2"
                            : "border-border-800/20 dark:border-text-400 hover:bg-surface-2 dark:hover:bg-surface-4"
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!showFullForm ? (
                <button
                  className={`w-full py-3 mt-4 rounded-lg font-medium ${
                    selectedDate && selectedTime
                      ? "bg-primary-2 text-white hover:bg-primary-2/90"
                      : "bg-surface-2 dark:bg-surface-4 cursor-not-allowed"
                  }`}
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setShowFullForm(true)}
                >
                  Continue to Booking
                </button>
              ) : null}
            </div>

            {showFullForm && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="font-medium border-b border-border-800/20 dark:border-text-400 pb-2">
                  Your Information
                </h3>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-border-800/20 dark:border-text-400 rounded-lg dark:outline-transparent"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full p-2 border border-border-800/20 dark:border-text-400 rounded-lg dark:outline-transparent"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full p-2 border border-border-800/20 dark:border-text-400 rounded-lg dark:outline-transparent"
                    placeholder="(123) 456-7890"
                    required
                  />
                </div>

                <div className="pt-2">
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id="createAccount"
                      className="mr-2"
                      checked={createAccount}
                      onChange={(e) => setCreateAccount(e.target.checked)}
                    />
                    <label htmlFor="createAccount" className="font-medium">
                      Create an account for faster booking next time
                    </label>
                  </div>

                  {createAccount && (
                    <div className="space-y-4 pl-6 border-l-2 border-primary-2/30">
                      <div>
                        <label className="text-sm font-medium mb-1 flex items-center">
                          <Lock className="w-4 h-4 mr-1" /> Password
                        </label>
                        <input
                          type="password"
                          className="w-full p-2 border border-border-800/20 dark:border-text-400 rounded-lg dark:outline-transparent"
                          placeholder="Create password (min 8 characters)"
                          required
                        />
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <h4 className="font-medium mb-2 flex items-center">
                          <Check className="w-4 h-4 mr-1 text-blue-500" />
                          Benefits of creating an account:
                        </h4>
                        <ul className="text-sm space-y-1">
                          <li className="flex items-start">
                            <Check className="w-3 h-3 mt-0.5 mr-1.5 flex-shrink-0 text-blue-500" />
                            Save your booking history
                          </li>
                          <li className="flex items-start">
                            <Check className="w-3 h-3 mt-0.5 mr-1.5 flex-shrink-0 text-blue-500" />
                            Faster checkout next time
                          </li>
                          <li className="flex items-start">
                            <Check className="w-3 h-3 mt-0.5 mr-1.5 flex-shrink-0 text-blue-500" />
                            Manage upcoming appointments
                          </li>
                          <li className="flex items-start">
                            <Check className="w-3 h-3 mt-0.5 mr-1.5 flex-shrink-0 text-blue-500" />
                            Exclusive member discounts
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 space-y-3">
                    <button
                      className="w-full py-3 bg-primary-2 text-white rounded-lg font-medium hover:bg-primary-2/90"
                      onClick={() => navigate("/booking-confirmation")}
                    >
                      {createAccount
                        ? "Create Account & Book Now"
                        : "Confirm Booking"}
                    </button>

                    {createAccount && (
                      <button
                        type="button"
                        className="w-full py-2 text-sm text-primary-2 hover:underline"
                        onClick={() => setCreateAccount(false)}
                      >
                        Continue without creating an account
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
