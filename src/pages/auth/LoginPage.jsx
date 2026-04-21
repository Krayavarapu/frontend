import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import FormInput from "../../components/auth/FormInput";
import { loginUser } from "../../api/api";
import { loginSchema } from "../../schemas/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await loginUser(values);
      const data = response.data || {};

      // Enforce restriction checks before considering session established.
      if (data.holds?.length || data.restrictions?.length) {
        toast.error("Your account is currently restricted. Contact support.");
        return;
      }

      if (response.status === 200 && data.session_token) {
        localStorage.setItem("session_token", data.session_token);
        localStorage.setItem("user_id", data.user_id);
        toast.success("Welcome back.");
        navigate("/dashboard");
        return;
      }

      toast.error("Unable to create a session.");
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error("Invalid username or password.");
        return;
      }
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-md rounded-xl bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold">Login</h1>
      <p className="mt-2 text-sm text-slate-600">Sign in with your username and password.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          id="username"
          label="Username"
          registration={register("username")}
          error={errors.username?.message}
          placeholder="Enter your username"
        />
        <FormInput
          id="password"
          label="Password"
          type="password"
          registration={register("password")}
          error={errors.password?.message}
          placeholder="Enter your password"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        Need an account?{" "}
        <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-700">
          Sign up
        </Link>
      </p>
    </div>
  );
}
