import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="container mx-auto px-4 pb-16 pt-10 md:py-28 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-2 to-accent-2 bg-clip-text text-transparent">
          Book Smarter, Not Harder
        </h1>
        <p className="text-lg font-semibold md:text-xl text-white dark:text-text-400 mb-8">
          Discover the easiest way to schedule appointments with your favorite
          service providers.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/book-services"
            className="px-8 py-3 bg-primary-2 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-primary-2/20 transition-all duration-300 transform hover:-translate-y-1"
          >
            Browse Services
          </Link>
          <button className="px-8 py-3 border-2 border-primary-2 text-primary-2 dark:text-primary-400 font-medium rounded-lg cursor-default">
            Book Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
