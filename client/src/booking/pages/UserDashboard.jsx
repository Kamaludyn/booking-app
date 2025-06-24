import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Settings,
  History,
  Scissors,
  ContactRound,
  Gem,
  ChevronRight,
  X,
  Edit,
} from "lucide-react";

export default function UserDashboard() {
  const [user, setUser] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    phone: "(555) 123-4567",
    memberSince: "January 2023",
  });

  const [appointments, setAppointments] = useState({
    upcoming: [
      {
        id: "BK789012",
        service: "Hair Styling",
        professional: "Sarah Johnson",
        date: "June 22, 2023",
        time: "2:00 PM",
        duration: "45 min",
        price: "$45.00",
        location: "Downtown Salon",
        paymentStatus: "Partial",
        amountPaid: 11.25,
      },
      {
        id: "BK345678",
        service: "Spa Treatment",
        professional: "Michael Chen",
        date: "July 5, 2023",
        time: "11:00 AM",
        duration: "60 min",
        price: "$85.00",
        location: "Westside Spa",
        paymentStatus: "Paid",
        amountPaid: 85.0,
      },
    ],

    past: [
      {
        id: "BK123456",
        service: "Nail Care",
        professional: "Emma Williams",
        date: "May 15, 2023",
        time: "3:30 PM",
        duration: "30 min",
        price: "$35.00",
        location: "Midtown Nails",
      },
    ],
  });

  const [activeTab, setActiveTab] = useState("upcoming");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  const cancelAppointment = (id) => {
    setAppointments((prev) => ({
      upcoming: prev.upcoming.filter((app) => app.id !== id),
      past: prev.past,
    }));
    setShowCancelModal(false);
  };

  const getServiceIcon = (serviceName) => {
    switch (serviceName) {
      case "Hair Styling":
        return <Scissors className="w-5 h-5" />;
      case "Spa Treatment":
        return <ContactRound className="w-5 h-5" />;
      case "Nail Care":
        return <Gem className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  const formatCurrency = (value) => `$${parseFloat(value).toFixed(2)}`;

  const getRemainingBalance = (priceStr, paid) => {
    const total = parseFloat(priceStr.replace("$", ""));
    const balance = total - (paid || 0);
    return balance > 0 ? formatCurrency(balance) : "$0.00";
  };

  return (
    <section className="container h-full mx-auto px-4 pb-8 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="z-10">Welcome back, </span>
            <span className="relative inline-block">
              <span className="relative z-10">{user.name}</span>
              <span className="absolute bottom-0 left-0 w-full h-2 bg-accent-3 dark:bg-accent-3/30 -rotate-1"></span>
            </span>
          </h1>
          <p className="text-text-600 dark:text-text-400">
            Member since {user.memberSince}
          </p>
        </div>
        <Link
          to="/account-settings"
          className="flex items-center text-primary-2 hover:underline mt-4 md:mt-0"
        >
          <Settings className="w-5 h-5 mr-1" /> Account Settings
        </Link>
      </div>
      <div className="bg-white dark:bg-surface-3 rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="border-b border-surface-2 dark:border-text-400/50 flex">
          <button
            className={`px-6 py-4 font-medium flex items-center ${
              activeTab === "upcoming"
                ? "text-primary-2 border-b-2 border-primary-2"
                : "text-text-500 dark:text-white"
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            <Calendar className="w-5 h-5 mr-2" />
            Upcoming
            <span className="ml-2 bg-surface-2 dark:bg-surface-4 px-2 py-0.5 rounded-full text-sm">
              {appointments.upcoming.length}
            </span>
          </button>
          <button
            className={`px-6 py-4 font-medium flex items-center ${
              activeTab === "past"
                ? "text-primary-2 border-b-2 border-primary-2"
                : "text-text-500 dark:text-white"
            }`}
            onClick={() => setActiveTab("past")}
          >
            <History className="w-5 h-5 mr-2" />
            Past
            <span className="ml-2 bg-surface-2 dark:bg-surface-4 px-2 py-0.5 rounded-full text-sm">
              {appointments.past.length}
            </span>
          </button>
        </div>

        <div className="divide-y divide-surface-2 dark:divide-text-400/50">
          {appointments[activeTab].length > 0 ? (
            appointments[activeTab].map((appointment) => (
              <div key={appointment.id} className="p-6">
                <div className="flex items-center md:gap-4">
                  <div className="self-start p-2 rounded-lg bg-primary-2/10 text-primary-2 mt-1">
                    {getServiceIcon(appointment.service)}
                  </div>
                  <div className="w-full md:w-2/3 flex items-center justify-center md:justify-between flex-col md:flex-row gap-4">
                    <div className="flex items-center gap-4 md:w-[60%]">
                      <div>
                        <h3 className="font-bold text-lg mb-1">
                          {appointment.service}
                        </h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                          <div className="flex items-center text-text-600 dark:text-text-400">
                            <Clock className="w-4 h-4 mr-1.5" />
                            {appointment.date} at {appointment.time}
                          </div>
                        </div>
                      </div>
                    </div>
                    {activeTab === "upcoming" && (
                      <div className="md:w-[38%] space-y-2 text-sm sm:text-base">
                        <div className="flex justify-between items-center gap-2">
                          <span className="font-medium text-text-600 dark:text-text-400">
                            Payment Status:
                          </span>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-white text-xs font-semibold ${
                              appointment.paymentStatus === "Paid"
                                ? "bg-green-500"
                                : appointment.paymentStatus === "Partial"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                          >
                            {appointment.paymentStatus}
                          </span>
                        </div>

                        {appointment.paymentStatus !== "Paid" && (
                          <div className="flex justify-between items-center gap-2">
                            <span className="font-medium text-text-600 dark:text-text-400">
                              Balance Remaining:
                            </span>
                            <span className="font-semibold text-text-700 dark:text-text-200">
                              {getRemainingBalance(
                                appointment.price,
                                appointment.amountPaid
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {activeTab === "upcoming" && (
                    <div className="flex flex-col md:flex-row gap-2">
                      <button className="p-2 text-primary-2 hover:bg-surface-2 dark:hover:bg-surface-4 rounded-lg">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 text-red-500 hover:bg-surface-2 dark:hover:bg-surface-4 rounded-lg"
                        onClick={() => {
                          setAppointmentToCancel(appointment.id);
                          setShowCancelModal(true);
                        }}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
                {activeTab === "past" && (
                  <div className="mt-4 flex justify-end">
                    <Link
                      to={`/booking/${appointment.id}`}
                      className="px-4 py-2 border border-surface-2 text-white dark:border-text-400/50 rounded-lg dark:bg-transparent bg-primary-2 hover:bg-primary-2/80 dark:hover:bg-text-400/50 text-sm font-medium"
                    >
                      Book Again
                    </Link>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <Calendar className="mx-auto w-12 h-12 text-text-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">
                {activeTab === "upcoming"
                  ? "No upcoming appointments"
                  : "No past appointments"}
              </h3>
              <p className="text-text-500 mb-4">
                {activeTab === "upcoming"
                  ? "Book a service to see it here"
                  : "Your completed appointments will appear here"}
              </p>
              <Link
                to="/book-services"
                className="inline-block px-6 py-2 bg-primary-2 text-white rounded-lg hover:bg-primary-2/90"
              >
                {activeTab === "upcoming"
                  ? "Book a Service"
                  : "Browse Services"}
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link
          to="/book-services"
          className="bg-white dark:bg-surface-3 p-6 rounded-xl shadow-sm border border-surface-2 dark:border-surface-3 hover:border-primary-400 dark:hover:border-primary-2 transition-colors"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Book New Service</h3>
            <ChevronRight className="w-5 h-5 text-primary-2" />
          </div>
          <p className="text-sm text-text-500 dark:text-text-400 mt-2">
            Schedule with your favorite professionals
          </p>
        </Link>
        <Link
          to="/favorites"
          className="bg-white dark:bg-surface-3 p-6 rounded-xl shadow-sm border border-surface-2 dark:border-surface-3 hover:border-primary-400 dark:hover:border-primary-2 transition-colors"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Your Favorites</h3>
            <ChevronRight className="w-5 h-5 text-primary-2" />
          </div>
          <p className="text-sm text-text-500 dark:text-text-400 mt-2">
            View your saved professionals and services
          </p>
        </Link>
        <Link
          to="/account-settings"
          className="bg-white dark:bg-surface-3 p-6 rounded-xl shadow-sm border border-surface-2 dark:border-surface-3 hover:border-primary-400 dark:hover:border-primary-2 transition-colors"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Account Settings</h3>
            <ChevronRight className="w-5 h-5 text-primary-2" />
          </div>
          <p className="text-sm text-text-500 dark:text-text-400 mt-2">
            Update your profile and preferences
          </p>
        </Link>
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-surface-3 rounded-xl shadow-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Cancel Appointment</h3>
            <p className="text-text-600 dark:text-text-400 mb-6">
              Are you sure you want to cancel this appointment? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border border-surface-2 dark:border-text-400/50 rounded-lg hover:bg-surface-2 dark:hover:bg-text-400/50"
                onClick={() => setShowCancelModal(false)}
              >
                Keep Appointment
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={() => cancelAppointment(appointmentToCancel)}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
