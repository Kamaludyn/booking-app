import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Eye, EyeOff } from "lucide-react";
import { ThreeDot } from "react-loading-indicators";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Toggle password visibility between text and password type
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    // Access the form element
    const loginForm = e.target;

    // Extracting form values and structuring them into an object
    const formData = {
      email: loginForm.email.value,
      password: loginForm.password.value,
    };

    try {
      const res = await api.post("/auth/login", formData);

      // Store the login data
      login(res.data.token, res.data.user);

      // redirect user based on role
      if (res.data.user.role === "vendor") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
      loginForm.reset();
    } catch (err) {
      if (err.message === "Network Error") {
        setMessage("Please check your network connection");
      } else {
        setMessage(err.response?.data?.message || "Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 mb-5">
      <div className="bg-white dark:bg-surface-3 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-xl md:text-2xl font-bold text-center text-gray-600 dark:text-gray-300 mb-6">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border border-border-800/20 dark:border-text-400 rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-primary-2 placeholder-gray-400 dark:placeholder-gray-500"
            required
          />
          <div className="group w-full flex justify-between p-2 pr-2 border border-border-800/20 dark:border-text-400 rounded-lg focus-within:ring-2 focus-within:ring-primary-2 focus-within:border-transparent">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              placeholder="Password"
              className="w-full h-full p-1 outline-0 placeholder-gray-400 dark:placeholder-gray-500"
              required
            />
            <button
              type="button"
              className="ml-2 text-xl cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOff className="mt-0.5 text-text-secondary" />
              ) : (
                <Eye className="mt-0.5 text-text-secondary" />
              )}
            </button>
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-semibold text-white bg-primary-2 hover:bg-primary-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition`}
            disabled={loading}
          >
            {loading ? (
              <ThreeDot color="white" size="small" textColor="blue" />
            ) : (
              "Login"
            )}
          </button>
          {message && <p className="mb-0.5 text-sm text-rose-600">{message}</p>}
        </form>
        <div>
          <div className="dark:text-white">
            Forgot Password?{" "}
            <Link
              to="/forgot-password"
              className="text-primary-3 my-2 hover:underline"
            >
              Click Here!
            </Link>
          </div>
          <div className="dark:text-white">
            Don't have an Account?{" "}
            <Link to="/sign-up" className="text-primary-3 hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
