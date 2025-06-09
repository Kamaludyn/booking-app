const listItems = [
  "No-hassle online booking",
  "Real-time availability",
  "Secure payment processing",
  "Instant confirmation",
  "Smart reminders",
  "24/7 customer support",
];

const WhyChooseUs = () => {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">
          <span className="relative inline-block">
            <span className="relative z-10">Why Choose Bookify</span>
            <span className="absolute bottom-0 left-0 w-full h-2 bg-accent-3 dark:bg-accent-3/30 -rotate-1"></span>
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {listItems.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 bg-surface-2 dark:bg-surface-3/50 p-4 rounded-lg hover:bg-surface- dark:hover:bg-surface-700 transition-colors duration-200"
            >
              <span className="text-green-500 mt-0.5">✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
