import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";

export default function CreateServicePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
    requireDeposit: false,
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newService = {
      ...formData,
      id: crypto.randomUUID(),
      duration: parseInt(formData.duration),
      price: parseFloat(formData.price),
    };

    navigate("/dashboard/services");
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-primary-500 hover:text-primary-500/70 p-2 bg-surface-600 dark:bg-surface-600/10 rounded-lg cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-semibold text-text-500 dark:text-white">
          Add New Sevice
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-surface-500 dark:bg-surface-800 p-6 rounded-xl border border-border-500 dark:border-border-800 shadow-sm"
      >
        <div>
          <label className="block text-sm text-text-400 mb-1">
            Service Name
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-border-500 dark:border-border-800 bg-transparent px-3 py-2 text-text-500 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm text-text-400 mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-lg border border-border-500 dark:border-border-800 bg-transparent px-3 py-2 text-text-500 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-400 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              name="duration"
              min="1"
              required
              value={formData.duration}
              onChange={handleChange}
              className="w-full rounded-lg border border-border-500 dark:border-border-800 bg-transparent px-3 py-2 text-text-500 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-text-400 mb-1">
              Price ($)
            </label>
            <input
              type="number"
              name="price"
              step="0.01"
              required
              value={formData.price}
              onChange={handleChange}
              className="w-full rounded-lg border border-border-500 dark:border-border-800 bg-transparent px-3 py-2 text-text-500 dark:text-white"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <input
            type="checkbox"
            id="requireDeposit"
            name="requireDeposit"
            checked={formData.requireDeposit}
            onChange={handleChange}
            className="accent-primary-500"
          />
          <label
            htmlFor="requireDeposit"
            className="text-sm text-text-500 dark:text-white"
          >
            Require deposit to book
          </label>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-primary-500 dark:bg-primary-500/50 text-white px-5 py-2 rounded-lg hover:opacity-90 cursor-pointer"
          >
            Save Service
          </button>
        </div>
      </form>
    </div>
  );
}
