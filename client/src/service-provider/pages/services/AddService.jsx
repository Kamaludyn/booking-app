import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import api from "../../../shared/services/api";
import { ChevronLeft } from "lucide-react";
import { toast } from "@acrool/react-toaster";
import { ThreeDot } from "react-loading-indicators";

export default function CreateServicePage({ selectedService }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    bufferTime: "",
    price: "",
    requireDeposit: false,
    depositAmount: "",
  });

  useEffect(() => {
    if (selectedService) {
      setFormData({
        name: selectedService.name || "",
        description: selectedService.description || "",
        duration: selectedService.duration || "",
        price: selectedService.price || "",
        bufferTime: selectedService.bufferTime || "",
        requireDeposit: selectedService.requireDeposit || false,
        depositAmount: selectedService.depositAmount || "",
      });
    }
  }, [selectedService]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare service data before sending to backend
    const serviceData = {
      name: formData.name,
      description: formData.description,
      price: parseInt(formData.price),
      requireDeposit: true,
      depositAmount: parseInt(formData.depositAmount),
      duration: parseInt(formData.duration),
      bufferTime: parseInt(formData.bufferTime),
      currency: import.meta.env.VITE_CURRENCY,
    };

    const fieldsToCompare = [
      "name",
      "description",
      "price",
      "duration",
      "bufferTime",
      "requireDeposit",
      "depositAmount",
    ];

    const hasChanges = fieldsToCompare.some(
      (field) => selectedService?.[field] !== serviceData[field]
    );

    try {
      if (selectedService) {
        if (!hasChanges) {
          toast.error("No changes made");
          setLoading(false);
          return;
        }

        const res = await api.patch(
          `/services/${selectedService._id}`,
          serviceData
        );
        console.log("edit res:", res.data);
      } else {
        console.log("create:", serviceData);
        const res = await api.post("/services", serviceData);
        toast.success(res.data.message);
      }
      queryClient.invalidateQueries(["services"]); // refresh the service list
      navigate("/dashboard/services");
    } catch (err) {
      console.log("error:", err);
      if (err.message === "Network Error") {
        toast.error("Please check your network connection");
      } else {
        toast.error(err.response?.data?.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
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
          {selectedService ? "Edit Service" : "Add New Service"}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-surface-500 dark:bg-surface-800 p-6 rounded-xl border border-border-500 dark:border-border-800 shadow-sm"
      >
        <div>
          <label className="block text-sm text-text-400 dark:text-text-700 mb-1">
            Service Name
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-border-500 dark:border-text-700/50 bg-background-800/5 dark:bg-transparent px-3 py-2 text-text-500 dark:text-white focus:ring focus:ring-primary-500 dark:focus:ring-white focus:border-transparent outline-0"
          />
        </div>

        <div>
          <label className="block text-sm text-text-400 dark:text-text-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows="2"
            required
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-lg border border-border-500 dark:border-text-700/50 bg-background-800/5 dark:bg-transparent px-3 py-2 text-text-500 dark:text-white focus:ring focus:ring-primary-500 dark:focus:ring-white focus:border-transparent outline-0"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-400 dark:text-text-700 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              name="duration"
              min="1"
              required
              value={formData.duration}
              onChange={handleChange}
              placeholder="eg. 90 for 1hr 30mins"
              className="w-full rounded-lg border border-border-500 dark:border-text-700/50 bg-background-800/5 dark:bg-transparent px-3 py-2 text-text-500 dark:text-white focus:ring focus:ring-primary-500 dark:focus:ring-white focus:border-transparent outline-0"
            />
          </div>
          <div>
            <label className="block text-sm text-text-400 dark:text-text-700 mb-1">
              Buffer Time (minutes)
            </label>
            <input
              type="number"
              name="bufferTime"
              value={formData.bufferTime}
              onChange={handleChange}
              placeholder="eg. 90 for 1hr 30mins"
              className="w-full rounded-lg border border-border-500 dark:border-text-700/50 bg-background-800/5 dark:bg-transparent px-3 py-2 text-text-500 dark:text-white focus:ring focus:ring-primary-500 dark:focus:ring-white focus:border-transparent outline-0"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-text-400 dark:text-text-700 mb-1">
            Price ($)
          </label>
          <input
            type="number"
            name="price"
            step="0.01"
            required
            value={formData.price}
            onChange={handleChange}
            className="w-1/2 rounded-lg border border-border-500 dark:border-text-700/50 bg-background-800/5 dark:bg-transparent px-3 py-2 text-text-500 dark:text-white focus:ring focus:ring-primary-500 dark:focus:ring-white focus:border-transparent outline-0"
          />
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
        {formData.requireDeposit && (
          <div>
            <label className="block text-sm text-text-400 dark:text-text-700 mb-1">
              Deposit Amount (25% default)
            </label>
            <input
              type="number"
              name="depositAmount"
              step="0.01"
              value={formData.depositAmount}
              onChange={handleChange}
              className="w-1/2 rounded-lg border border-border-500 dark:border-text-700/50 bg-background-800/5 dark:bg-transparent px-3 py-2 text-text-500 dark:text-white focus:ring focus:ring-primary-500 dark:focus:ring-white focus:border-transparent outline-0"
            />
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className={`bg-primary-500 dark:bg-primary-500/50 text-white px-5 py-2 rounded-lg hover:opacity-90 cursor-pointer ${
              loading && "cursor-not-allowed px-11.5"
            }`}
          >
            {loading ? (
              <ThreeDot color="white" size="small" textColor="blue" />
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
