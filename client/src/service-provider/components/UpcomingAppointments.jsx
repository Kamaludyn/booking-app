export default function UpcomingAppointments({ appointments }) {
  return (
    <div className="bg-surface-500 dark:bg-surface-800 p-4 rounded-xl border border-border-500 dark:border-border-800 shadow-sm hover:shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-text-500 dark:text-white">
        Upcoming Appointments
      </h2>
      <ul className="space-y-3">
        {appointments.map(({ id, name, time, service }) => (
          <li key={id} className="flex justify-between items-center">
            <div>
              <p className="font-medium text-text-500 dark:text-white">
                {name}
              </p>
              <p className="text-sm text-text-400 dark:text-text-700">
                {service}
              </p>
            </div>
            <span className="text-sm text-text-400 dark:text-text-700">
              {time}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
