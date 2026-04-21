import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import FormInput from "../../components/auth/FormInput";
import { signupUser } from "../../api/api";
import { buildSignupPayload, signupSchema } from "../../schemas/auth";

const genderOptions = ["Male", "Female", "Non-Binary"];

export default function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      height_feet: "",
      height_inches: "",
      weight_lbs: "",
      gender: "Male",
      dob: "",
      user_id: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = buildSignupPayload(values);
      const response = await signupUser(payload);
      if (response.status === 201) {
        toast.success("Signup completed successfully.");
        return;
      }
      toast.error("Signup failed. Please try again.");
    } catch {
      toast.error("Signup failed. Please verify your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-2xl rounded-xl bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold">Signup</h1>
      <p className="mt-2 text-sm text-slate-600">Create your fitness account.</p>

      <form className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          id="first_name"
          label="First Name"
          registration={register("first_name")}
          error={errors.first_name?.message}
        />
        <FormInput
          id="last_name"
          label="Last Name"
          registration={register("last_name")}
          error={errors.last_name?.message}
        />
        <FormInput
          id="height_feet"
          label="Height (ft)"
          type="number"
          min={0}
          registration={register("height_feet")}
          error={errors.height_feet?.message}
        />
        <FormInput
          id="height_inches"
          label="Height (in)"
          type="number"
          min={0}
          max={11}
          registration={register("height_inches")}
          error={errors.height_inches?.message}
        />
        <FormInput
          id="weight_lbs"
          label="Weight (lbs)"
          type="number"
          min={1}
          registration={register("weight_lbs")}
          error={errors.weight_lbs?.message}
        />

        <div>
          <label htmlFor="gender" className="mb-1 block text-sm font-medium text-slate-700">
            Gender
          </label>
          <select
            id="gender"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            {...register("gender")}
          >
            {genderOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.gender?.message && <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>}
        </div>

        <FormInput
          id="dob"
          label="Date of Birth"
          type="date"
          registration={register("dob")}
          error={errors.dob?.message}
        />
        <FormInput
          id="user_id"
          label="User ID"
          registration={register("user_id")}
          error={errors.user_id?.message}
        />
        <div className="md:col-span-2">
          <FormInput
            id="password"
            label="Password"
            type="password"
            registration={register("password")}
            error={errors.password?.message}
            placeholder="Min 8 chars, 1 number, 1 special char"
          />
        </div>

        <div className="md:col-span-2 space-y-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
          >
            Go to Login
          </button>
        </div>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
          Sign in
        </Link>
      </p>
    </div>
  );
}
