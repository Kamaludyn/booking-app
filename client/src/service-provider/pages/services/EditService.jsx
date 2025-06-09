import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ServiceForm from "../../components/services/ServiceForm";
import { mockServices } from "../../mock/services";

export default function EditServicePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);

  useEffect(() => {
    const selected = mockServices.find((s) => s.id === id);
    setService(selected);
  }, [id]);

  const handleUpdate = (updatedData) => {
    console.log("Updated service:", updatedData);
    navigate("/dashboard/services");
  };

  if (!service) {
    return (
      <div className="text-center text-text-400 p-6">Service not found.</div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold text-text-500 mb-4">
        Edit Service
      </h1>
      <ServiceForm
        initialData={service}
        onSubmit={handleUpdate}
        isEditing={true}
      />
    </div>
  );
}
