import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ClientForm from "../../components/ClientForm";

export default function EditClientPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setClientData(data);
      } catch (error) {
        console.error("Failed to fetch client:");
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const handleUpdateClient = async (updatedData) => {
    try {
      await fetch(`/api/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      navigate("/dashboard/clients");
    } catch (error) {
      console.error("Failed to update client:", error);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-500 mb-4">Edit Client</h1>
      <ClientForm
        initialData={clientData}
        onSubmit={handleUpdateClient}
        isEditing={true}
      />
    </div>
  );
}
