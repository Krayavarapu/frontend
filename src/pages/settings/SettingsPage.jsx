import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import FormInput from "../../components/auth/FormInput";
import { getUserById, updateUserSettings } from "../../api/api";
import { settingsSchema } from "../../schemas/auth";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      height: "",
      weight_lbs: "",
      gender: "",
      date_of_birth: "",
      created_by: "",
    },
  });

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      return;
    }

    const loadUser = async () => {
      try {
        const response = await getUserById(userId);
        const data = response.data;
        setValue("first_name", data.first_name);
        setValue("last_name", data.last_name);
        setValue("height", data.height);
        setValue("weight_lbs", data.weight_lbs);
        setValue("gender", data.gender);
        setValue("date_of_birth", data.date_of_birth);
        setValue("created_by", data.created_by);
      } catch {
        toast.error("Unable to load your profile.");
      }
    };

    loadUser();
  }, [setValue]);

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      await updateUserSettings(values);
      toast.success("Settings updated.");
    } catch {
      toast.error("Unable to update settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-2xl rounded-xl bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="mt-2 text-sm text-slate-600">Update your user profile fields.</p>

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
          id="height"
          label="Height (total inches)"
          type="number"
          min={1}
          registration={register("height")}
          error={errors.height?.message}
        />
        <FormInput
          id="weight_lbs"
          label="Weight (lbs)"
          type="number"
          min={1}
          registration={register("weight_lbs")}
          error={errors.weight_lbs?.message}
        />
        <FormInput
          id="gender"
          label="Gender"
          registration={register("gender")}
          error={errors.gender?.message}
        />
        <FormInput
          id="date_of_birth"
          label="Date of Birth"
          type="date"
          registration={register("date_of_birth")}
          error={errors.date_of_birth?.message}
        />
        <div className="md:col-span-2">
          <FormInput
            id="created_by"
            label="Created By (date)"
            type="date"
            registration={register("created_by")}
            error={errors.created_by?.message}
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
