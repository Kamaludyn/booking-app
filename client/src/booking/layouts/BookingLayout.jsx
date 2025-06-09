import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";

const BookingLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#cfe6ff] to-[#63b1ff] dark:from-surface-4 dark:to-surface-3 text-text-500 dark:text-white transition-colors duration-300 pt-20 mx-auto">
      <Nav />
      <Outlet />
    </div>
  );
};

export default BookingLayout;
