const timezones = Intl.supportedValuesOf("timeZone");

export default function TimezoneSelect({ value, onChange, name = "timezone" }) {
  return (
    <div className="flex flex-col space-y-1">
      <label
        htmlFor={name}
        className="text-sm font-medium text-text-500 dark:text-white"
      >
        Timezone
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="bg-surface-500 dark:bg-surface-800 text-text-500 dark:text-white border border-border-500 dark:border-border-800 rounded-lg px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-primary-500 outline-transparent shadow-sm hover:shadow-md"
      >
        {timezones.map((tz) => (
          <option key={tz} value={tz}>
            {tz}
          </option>
        ))}
      </select>
    </div>
  );
}
