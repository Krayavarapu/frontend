import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { regeneratePlan } from "../../api/api";
import { planRequestSchema } from "../../schemas/plan";

function loadStoredPlan() {
  try {
    const rawPlan = sessionStorage.getItem("latest_plan");
    const rawRequest = sessionStorage.getItem("latest_plan_request");
    return {
      plan: rawPlan ? JSON.parse(rawPlan) : null,
      request: rawRequest ? JSON.parse(rawRequest) : null,
    };
  } catch {
    return { plan: null, request: null };
  }
}

export default function PlanResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const fallback = useMemo(() => loadStoredPlan(), []);
  const initialPlan = location.state?.plan || fallback.plan;
  const initialRequest = location.state?.request || fallback.request || { prompt: "", goal: "", equipment: "" };
  const [plan, setPlan] = useState(initialPlan);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(planRequestSchema),
    defaultValues: {
      prompt: initialRequest.prompt || "",
      goal: initialRequest.goal || "",
      equipment: initialRequest.equipment || "",
    },
  });

  if (!plan) {
    return (
      <div className="mx-auto mt-20 max-w-xl rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">No plan available</h1>
        <p className="mt-2 text-slate-600">Generate a plan first to view results.</p>
        <button
          type="button"
          onClick={() => navigate("/plan/generate")}
          className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
        >
          Go to Generate Plan
        </button>
      </div>
    );
  }

  const onRegenerate = async (values) => {
    setLoading(true);
    try {
      const response = await regeneratePlan({
        ...values,
        previous_plan_id: plan.plan_id,
      });
      const nextPlan = response.data;
      setPlan(nextPlan);
      sessionStorage.setItem("latest_plan", JSON.stringify(nextPlan));
      sessionStorage.setItem("latest_plan_request", JSON.stringify(values));
      toast.success("Plan regenerated.");
    } catch {
      toast.error("Failed to regenerate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-4xl space-y-6">
      <div className="rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">{plan.title}</h1>
        <p className="mt-2 text-slate-600">{plan.summary}</p>
        <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">
          Generated At: {new Date(plan.generated_at).toLocaleString()}
        </p>
        {plan.notes && <p className="mt-2 text-sm text-indigo-700">{plan.notes}</p>}
      </div>

      <div className="rounded-xl bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Workout Sections</h2>
        <div className="mt-4 space-y-4">
          {plan.workouts.map((section) => (
            <div key={section.name} className="rounded-lg border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-900">{section.name}</h3>
              <p className="text-sm text-slate-500">Duration: {section.duration_minutes} minutes</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
                {section.exercises.map((exercise) => (
                  <li key={exercise}>{exercise}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Regenerate Plan</h2>
        <p className="mt-1 text-sm text-slate-600">Update prompt, goal, or equipment and regenerate.</p>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit(onRegenerate)}>
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
              {...register("prompt")}
            />
            {errors.prompt?.message && <p className="mt-1 text-sm text-red-600">{errors.prompt.message}</p>}
          </div>

          <div>
            <label htmlFor="goal" className="mb-1 block text-sm font-medium text-slate-700">
              Goal
            </label>
            <input
              id="goal"
              className={`w-full rounded-lg border px-3 py-2 outline-none transition ${
                errors.goal
                  ? "border-red-500 ring-2 ring-red-200"
                  : "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              }`}
              {...register("goal")}
            />
            {errors.goal?.message && <p className="mt-1 text-sm text-red-600">{errors.goal.message}</p>}
          </div>

          <div>
            <label htmlFor="equipment" className="mb-1 block text-sm font-medium text-slate-700">
              Equipment
            </label>
            <input
              id="equipment"
              className={`w-full rounded-lg border px-3 py-2 outline-none transition ${
                errors.equipment
                  ? "border-red-500 ring-2 ring-red-200"
                  : "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              }`}
              {...register("equipment")}
            />
            {errors.equipment?.message && <p className="mt-1 text-sm text-red-600">{errors.equipment.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
          >
            {loading ? "Regenerating..." : "Regenerate Plan"}
          </button>
        </form>
      </div>
    </div>
  );
}
