export default function FormInput({
  id,
  label,
  type = "text",
  registration,
  error,
  placeholder,
  ...rest
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`w-full rounded-lg border px-3 py-2 outline-none transition ${
          error
            ? "border-red-500 ring-2 ring-red-200"
            : "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        }`}
        {...registration}
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
