export default function TimePicker({ label, name, value, onChange, disabled }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };
  return (
    <div className="flex flex-col space-y-1">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-text-500 dark:text-white"
        >
          {label}
        </label>
      )}
      <input
        type="time"
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="bg-surface-500 dark:bg-surface-800 text-text-500 dark:text-white border border-border-500 dark:border-border-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 focus:border-transparent"
      />
    </div>
  );
}
