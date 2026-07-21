import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axioxInstance";
import { useAuthStore } from "../lib/useAuthStore";
import axios from "axios";
import toast from "react-hot-toast";

interface LoginForm {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const Login = () => {
  const navigate = useNavigate();
  const setAuthUser = useAuthStore((s) => s.setAuthUser);
  const {connectSocket} = useAuthStore()
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
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
      const res = await axiosInstance.post("/auth/signin", {
        email: form.email.trim(),
        password: form.password,
      });
      setAuthUser(res.data.user);
      toast.success("Welcome to Whispr! 🎉");
      connectSocket();
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Login failed. Please try again.";
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
        <div className="rounded-2xl border border-[#E4DCCF] bg-white px-8 py-10 shadow-sm">
          <form
            id="login-form"
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5"
          >
            {/* Email Address */}
            <div>
              <label
                htmlFor="login-email"
                className="mb-1.5 block text-sm font-semibold text-[#1a1a1a]"
              >
                Email Address
              </label>
              <input
                id="login-email"
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
                htmlFor="login-password"
                className="mb-1.5 block text-sm font-semibold text-[#1a1a1a]"
              >
                Password
              </label>
              <input
                id="login-password"
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

            {/* Submit Button */}
            <button
              id="login-submit-btn"
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
                  Logging in…
                </>
              ) : (
                <span>Login &nbsp;›</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 h-px bg-[#E4DCCF]" />

          {/* Signup link */}
          <p className="text-center text-sm text-[#6b6b64]">
            Don't have an account?
            <Link
              to="/signup"
              className="font-bold text-[#0F3D2E] hover:text-[#22C55E] transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
