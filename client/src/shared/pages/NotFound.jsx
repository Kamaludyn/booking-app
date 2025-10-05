import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center bg-background-500 dark:bg-background-800 min-h-screen text-center px-4">
      <h1 className="text-5xl font-bold mb-4 text-primary-500">404</h1>
      <p className="text-lg text-text-400 mb-6">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Link
        to={-1}
        className="px-6 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
