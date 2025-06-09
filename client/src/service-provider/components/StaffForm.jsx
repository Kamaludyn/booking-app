import { useNavigate } from "react-router-dom";

export default function NewStaffPage() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Staff member created!");
    navigate("/dashboard/staff");
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-text-500 dark:text-white">
        New Staff Member
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-surface-500 dark:bg-surface-800 p-6 rounded-xl border border-border-500 dark:border-border-800 shadow-sm hover:shadow-md"
      >
        <div className="flex flex-col space-y-1">
          <label className="text-sm text-text-400">Full Name</label>
          <input
            required
            type="text"
            placeholder="Enter name"
            className="p-2 rounded-lg bg-white dark:bg-background-800 text-text-500 dark:text-white border border-border-500 dark:border-border-800"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm text-text-400">Phone</label>
          <input
            required
            type="number"
            placeholder="+1 2345-4345"
            className="p-2 rounded-lg bg-white dark:bg-background-800 text-text-500 dark:text-white border border-border-500 dark:border-border-800"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm text-text-400">Email</label>
          <input
            required
            type="email"
            placeholder="staff@example.com"
            className="p-2 rounded-lg bg-white dark:bg-background-800 text-text-500 dark:text-white border border-border-500 dark:border-border-800"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm text-text-400">Role</label>
          <select
            required
            className="p-2 rounded-lg bg-white dark:bg-background-800 text-text-500 dark:text-white border border-border-500 dark:border-border-800"
          >
            <option value="">Select role</option>
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
          >
            Create Staff Member
          </button>
        </div>
      </form>
    </div>
  );
}
