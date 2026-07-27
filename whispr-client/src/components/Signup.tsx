import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axioxInstance";
import { useAuthStore } from "../lib/useAuthStore";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface SignupForm {
  fullName: string;
  email: string;
  password: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
}

const Signup = () => {
  const navigate = useNavigate();
  const setAuthUser = useAuthStore((s) => s.setAuthUser);
  const {connectSocket} = useAuthStore();
  const [form, setForm] = useState<SignupForm>({
    fullName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    else if (form.fullName.trim().length < 2)
      newErrors.fullName = "Name must be at least 2 characters";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = form.email.trim();
    if (!email) newErrors.email = "Email is required";
    else if (!emailRegex.test(email))
      newErrors.email = "Enter a valid email address";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Min. 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await axiosInstance.post("/auth/signup", {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setAuthUser(res.data.user);
      toast.success("Account created! Welcome to Whispr 🎉");
      connectSocket()
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Signup failed. Please try again.";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  /* Shared input class */
  const inputBase =
    "w-full rounded-xl border bg-[#F4F1EA] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#b5b0a8] outline-none transition-all focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20";
  const inputError =
    "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-100";
  const inputNormal = "border-[#E4DCCF]";

  return (
    <div className="min-h-screen w-full bg-[#FBF4EC] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-2xl border border-[#E4DCCF] bg-white px-8 py-10 shadow-sm"
        >
          <div className="text-center pb-8 flex flex-col items-center">
            <img src="/logo.png" alt="Whispr Logo" className="mb-3 h-14 w-14 rounded-2xl shadow-md object-contain" />
            <h2 className="text-2xl font-bold text-[#1a1a1a] pb-2">
              Create New Account
            </h2>
            <p className="text-xs text-[#6b6b64]">
              Join Our Realtime Messaging Community
            </p>
          </div>
          <form
            id="signup-form"
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5"
          >
            {/* Full Name */}
            <div>
              <label
                htmlFor="signup-fullname"
                className="mb-1.5 block text-sm font-semibold text-[#1a1a1a]"
              >
                Full Name
              </label>
              <input
                id="signup-fullname"
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                className={`${inputBase} ${errors.fullName ? inputError : inputNormal}`}
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="signup-email"
                className="mb-1.5 block text-sm font-semibold text-[#1a1a1a]"
              >
                Email Address
              </label>
              <input
                id="signup-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="signup-password"
                className="mb-1.5 block text-sm font-semibold text-[#1a1a1a]"
              >
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                className={`${inputBase} ${errors.password ? inputError : inputNormal}`}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Terms */}
            <p className="text-center text-xs text-[#6b6b64]">
              By signing up, you agree to our{" "}
              <a
                href="#"
                className="font-semibold text-[#22C55E] hover:text-[#1ea852] transition-colors"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="font-semibold text-[#22C55E] hover:text-[#1ea852] transition-colors"
              >
                Privacy Policy
              </a>
              .
            </p>

            {/* Submit Button */}
            <button
              id="signup-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-[#22C55E] py-3.5 text-base cursor-pointer font-semibold text-white transition-all hover:bg-[#1ea852] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Creating account…
                </>
              ) : (
                <span className="inline-flex items-center">
                  Create Account{" "}
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 h-px bg-[#E4DCCF]" />

          {/* Login link */}
          <p className="text-center text-sm text-[#6b6b64]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-[#0F3D2E] hover:text-[#22C55E] transition-colors"
            >
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
