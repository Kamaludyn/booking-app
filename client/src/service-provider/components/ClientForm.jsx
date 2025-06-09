import { useState, useEffect } from "react";

export default function ClientForm({
  onSubmit,
  initialData = {},
  isEditing = false,
}) {
  const [name, setName] = useState(initialData.name || "");
  const [email, setEmail] = useState(initialData.email || "");
  const [phone, setPhone] = useState(initialData.phone || "");
  const [notes, setNotes] = useState(initialData.notes || "");

  useEffect(() => {
    setName(initialData.name || "");
    setEmail(initialData.email || "");
    setPhone(initialData.phone || "");
    setNotes(initialData.notes || "");
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, phone, notes });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-surface-500 dark:bg-surface-800 p-6 rounded-xl border border-border-500 dark:border-border-800 shadow-sm hover:shadow-md"
    >
      <div>
        <label className="block font-medium text-sm text-text-400 mb-1">
          Full Name
        </label>
        <input
          type="text"
          className="w-full bg-white dark:bg-background-800 text-text-500 dark:text-white dark:border-border-800 border border-border-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block font-medium text-sm text-text-400 mb-1">
          Email
        </label>
        <input
          type="email"
          className="w-full bg-white dark:bg-background-800 text-text-500 dark:text-white dark:border-border-800 border border-border-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block font-medium text-sm text-text-400 mb-1">
          Phone
        </label>
        <input
          type="tel"
          className="w-full bg-white dark:bg-background-800 text-text-500 dark:text-white dark:border-border-800 border border-border-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium text-sm text-text-400 mb-1">
          Notes
        </label>
        <textarea
          className="w-full bg-white dark:bg-background-800 text-text-500 dark:text-white dark:border-border-800 border border-border-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        ></textarea>
      </div>

      <button
        type="submit"
        className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg"
      >
        {isEditing ? "Update Client" : "Add Client"}
      </button>
    </form>
  );
}
