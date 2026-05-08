import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getActivePlan, getUserById } from "../../api/api";

export default function HomePage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [loadingName, setLoadingName] = useState(true);
  const [activePlan, setActivePlan] = useState(null);

  const activePlans = useMemo(() => (activePlan ? [activePlan] : []), [activePlan]);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setLoadingName(false);
      return;
    }

    const loadName = async () => {
      try {
        const response = await getUserById(userId);
        setFirstName(response.data?.first_name || userId);
      } catch {
        setFirstName(userId);
      } finally {
        setLoadingName(false);
      }
    };

    loadName();
  }, []);

  useEffect(() => {
    const loadActivePlan = async () => {
      try {
        const response = await getActivePlan();
        setActivePlan(response.data);
        sessionStorage.setItem("latest_plan", JSON.stringify(response.data));
      } catch {
        setActivePlan(null);
      }
    };

    loadActivePlan();
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome{loadingName ? "" : `, ${firstName || "Athlete"}`}
        </h1>
        <p className="mt-2 text-slate-600">Here are your active plans.</p>
        {activePlan && (
          <p className="mt-2 text-sm text-indigo-700">
            Active plan: {activePlan.title} ({activePlan.duration_days} days)
          </p>
        )}
      </section>

      <section className="rounded-xl bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Active Plans</h2>
        {activePlans.length === 0 ? (
          <p className="mt-4 text-slate-600">No active plan yet. Generate one to get started.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {activePlans.map((plan) => (
              <li key={plan.plan_id}>
                <button
                  type="button"
                  onClick={() => navigate("/plan/results", { state: { plan } })}
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
                >
                  <p className="font-medium text-slate-900">{plan.title}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {plan.duration_days} days • {plan.days?.length || 0} daily workouts
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
