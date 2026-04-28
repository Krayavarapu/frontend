import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import FormInput from "../../components/auth/FormInput";
import { generatePlan } from "../../api/api";
import { planRequestSchema } from "../../schemas/plan";

export default function GeneratePlanPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(planRequestSchema),
    defaultValues: {
      prompt: "",
      goal: "",
      equipment: "",
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await generatePlan(values);
      const plan = response.data;
      sessionStorage.setItem("latest_plan", JSON.stringify(plan));
      sessionStorage.setItem("latest_plan_request", JSON.stringify(values));
      navigate("/plan/results", { state: { plan, request: values } });
    } catch {
      toast.error("Failed to generate a plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-3xl rounded-xl bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Generate Fitness Plan</h1>
      <p className="mt-2 text-sm text-slate-600">Share your goal, prompt, and available equipment.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="prompt" className="mb-1 block text-sm font-medium text-slate-700">
            Prompt
          </label>
          <textarea
            id="prompt"
            className={`min-h-24 w-full rounded-lg border px-3 py-2 outline-none transition ${
              errors.prompt
                ? "border-red-500 ring-2 ring-red-200"
                : "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            }`}
            placeholder="Example: I want a 3-day beginner strength plan."
            {...register("prompt")}
          />
          {errors.prompt?.message && <p className="mt-1 text-sm text-red-600">{errors.prompt.message}</p>}
        </div>

        <FormInput
          id="goal"
          label="Goal"
          registration={register("goal")}
          error={errors.goal?.message}
          placeholder="Example: Build strength"
        />

        <FormInput
          id="equipment"
          label="Available Equipment"
          registration={register("equipment")}
          error={errors.equipment?.message}
          placeholder="Example: Dumbbells, resistance bands, bench"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
        >
          {loading ? "Generating..." : "Generate Plan"}
        </button>
      </form>
    </div>
  );
}
