import { Calendar, Bell, CreditCard, Search } from "lucide-react";

const guide = [
  {
    title: "Find Services",
    description: "Browse our curated list of professional services",
    icon: <Search className="w-8 h-8" />,
    color: "text-blue-500",
  },
  {
    title: "Book Instantly",
    description: "Select your preferred date and time",
    icon: <Calendar className="w-8 h-8" />,
    color: "text-purple-500",
  },
  {
    title: "Secure Payment",
    description: "Pay safely with our encrypted system",
    icon: <CreditCard className="w-8 h-8" />,
    color: "text-green-500",
  },
  {
    title: "Get Reminders",
    description: "Never miss an appointment with our alerts",
    icon: <Bell className="w-8 h-8" />,
    color: "text-orange-500",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-surface-2 dark:bg-surface-4/50 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">
          <span className="relative inline-block">
            <span className="relative z-10">How It Works</span>
            <span className="absolute bottom-0 left-0 w-full h-2 bg-accent-3 dark:bg-accent-3/30 -rotate-1"></span>
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guide.map((step, index) => (
            <div
              key={index}
              className="bg-white dark:bg-surface-3 p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-transparent hover:border-primary-400 dark:hover:border-primary-2"
            >
              <div
                className={`w-12 h-12 rounded-full ${step.color} bg-opacity-20 flex items-center justify-center mb-4`}
              >
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-text-600 dark:text-text-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
