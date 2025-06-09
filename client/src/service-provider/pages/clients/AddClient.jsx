import { useNavigate } from "react-router-dom";
import ClientForm from "../../components/ClientForm";
import { ChevronLeft } from "lucide-react";

export default function AddClientPage() {
  const navigate = useNavigate();

  const handleAddClient = async (clientData) => {
    try {
      await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData),
      });

      navigate("/dashboard/clients");
    } catch (error) {
      console.error("Failed to add client:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-primary-500 hover:text-primary-500/70 p-2 bg-primary-500/20 rounded-lg cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-semibold text-text-500 dark:text-white">
          Add New Client
        </h1>
      </div>
      <ClientForm onSubmit={handleAddClient} />
    </div>
  );
}
