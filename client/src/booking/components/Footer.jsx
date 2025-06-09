import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="dark:bg-surface-4/10 border-t border-dashed border-white py-12 md:py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
          Ready to Book Your Next Appointment?
        </h2>
        <Link
          to="/book-services"
          className="inline-block px-8 py-3 bg-white text-primary-2 font-medium rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Get Started Now
        </Link>
      </div>
      <div className="container mx-auto px-4 text-center mt-4">
        <p className="text-white">
          &copy; {new Date().getFullYear()} Bookify. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
