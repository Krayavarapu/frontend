import { useEffect, useMemo, useState } from "react";
import { getUserById } from "../../api/api";

const defaultWorkouts = [
  "Upper Body Strength",
  "Lower Body Strength",
  "Core and Mobility",
];

export default function HomePage() {
  const [firstName, setFirstName] = useState("");
  const [loadingName, setLoadingName] = useState(true);

  const activeWorkouts = useMemo(() => {
    try {
      const rawPlan = sessionStorage.getItem("latest_plan");
      if (!rawPlan) {
        return defaultWorkouts;
      }
      const parsed = JSON.parse(rawPlan);
      const workoutNames = (parsed.workouts || []).map((section) => section.name).filter(Boolean);
      return workoutNames.length > 0 ? workoutNames : defaultWorkouts;
    } catch {
      return defaultWorkouts;
    }
  }, []);

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

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome{loadingName ? "" : `, ${firstName || "Athlete"}`}
        </h1>
        <p className="mt-2 text-slate-600">Here are your active workouts for this session.</p>
      </section>

      <section className="rounded-xl bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Active Workouts</h2>
        <ul className="mt-4 space-y-3">
          {activeWorkouts.map((workout) => (
            <li key={workout} className="rounded-lg border border-slate-200 px-4 py-3 text-slate-800">
              {workout}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
