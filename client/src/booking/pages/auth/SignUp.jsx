import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../shared/services/api";
import { ThreeDot } from "react-loading-indicators";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const signUpForm = e.target;

    if (signUpForm.password.value !== signUpForm.confirmPassword.value) {
      setMessage("Passwords do not match!");
      setLoading(false);
      return;
    }

    const formData = {
      surname: signUpForm.surname.value,
      othername: signUpForm.othername.value,
      email: signUpForm.email.value,
      password: signUpForm.password.value,
    };

    try {
      const res = await api.post("/auth/register/client", formData);

      // Redirect user to Home page after successful registration
      navigate("/login");

      signUpForm.reset();
    } catch (err) {
      setMessage(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 mb-5">
      <div className="bg-white dark:bg-surface-3 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-xl md:text-2xl font-bold text-center text-gray-600 dark:text-gray-300 mb-6">
          Create your account to start booking
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="surname"
            placeholder="Surname"
            className="w-full p-2 border border-border-800/20 dark:border-text-400 rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-primary-2"
            required
          />
          <input
            type="text"
            name="othername"
            placeholder="Other Name"
            className="w-full p-2 border border-border-800/20 dark:border-text-400 rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-primary-2"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border border-border-800/20 dark:border-text-400 rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-primary-2"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border border-border-800/20 dark:border-text-400 rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-primary-2"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full p-2 border border-border-800/20 dark:border-text-400 rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-primary-2"
            required
          />
          {message && <p className="text-sm text-rose-500">{message}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white bg-primary-2 hover:bg-primary-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition${
              loading && "cursor-not-allowed"
            }`}
          >
            {loading ? (
              <ThreeDot color="white" size="small" textColor="blue" />
            ) : (
              "Sign up"
            )}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to={"/login"}
            className="text-primary-2 dark:text-primary-11 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
