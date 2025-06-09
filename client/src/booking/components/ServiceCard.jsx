import { Link } from "react-router-dom";

export default function ServiceCard({ service }) {
  return (
    <Link
      to={`/booking/${service.id}`}
      className="bg-background-card border border-border p-4 rounded-2xl hover:shadow-md transition"
    >
      {service.image && (
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-40 object-cover rounded-lg mb-4"
        />
      )}

      <h3 className="text-xl font-semibold mb-1">{service.name}</h3>
      <p className="text-text-400 text-sm line-clamp-2">
        {service.description}
      </p>

      <div className="mt-4 flex justify-between text-sm text-text-500">
        <span>{service.duration} mins</span>
        <span>${service.price.toFixed(2)}</span>
      </div>
    </Link>
  );
}
