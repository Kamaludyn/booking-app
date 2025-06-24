import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Phone,
  Mail,
  MoreVertical,
  ArrowUpDown,
  Plus,
} from "lucide-react";
import { useClients } from "../../hooks/UseClients";
import PageHeader from "../../components/PageHeader";

export default function Clients() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const navigate = useNavigate();
  const clients = useClients();

  const filteredClients = clients
    .filter(
      (client) =>
        client.name.toLowerCase().includes(search.toLowerCase()) ||
        client.contact.phone.includes(search)
    )
    .sort((a, b) => {
      if (sortBy === "spend") return b.stats.totalSpent - a.stats.totalSpent;
      return new Date(b.stats.lastVisit) - new Date(a.stats.lastVisit);
    });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        subtitle={`${filteredClients.length} clients found`}
        actionLabel="New Client"
        onActionClick={() => navigate("/dashboard/clients/new")}
        actionIcon={Plus}
        isButton
      />
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-400" />
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-500 dark:bg-surface-800 border border-border-500 dark:border-border-800 text-text-500 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-transparent shadow-sm hover:shadow-md"
          />
        </div>

        <button
          onClick={() =>
            setSortBy((prev) => (prev === "recent" ? "spend" : "recent"))
          }
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-500 dark:bg-surface-800 border border-border-500 dark:border-border-800 text-text-500 dark:text-white text-sm shadow-sm hover:shadow-md"
        >
          <ArrowUpDown size={16} />
          {sortBy === "recent" ? "Recent Activity" : "Total Spend"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-text-500 dark:text-white">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="p-4 rounded-lg bg-surface-500 dark:bg-surface-800 border border-border-500 dark:border-border-800 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 font-medium">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium">{client.name}</h3>
                  <div className="flex flex-col text-xs text-text-300 dark:text-text-600">
                    <span className="flex items-center gap-1">
                      <Phone size={12} /> {client.contact.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail size={12} /> {client.contact.email}
                    </span>
                  </div>
                </div>
              </div>

              <button className="text-text-400 hover:text-primary-500 cursor-pointer">
                <MoreVertical size={16} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="p-2 rounded bg-surface-600 dark:bg-transparent border border-border-500 dark:border-border-800">
                <p className="text-sm font-medium">
                  {client.stats.totalAppointments}
                </p>
                <p className="text-xs ">Visits</p>
              </div>
              <div className="p-2 rounded bg-surface-600 dark:bg-transparent border border-border-500 dark:border-border-800">
                <p className="text-sm font-medium text-danger-500 dark:text-danger-400">
                  {client.stats.missed}
                </p>
                <p className="text-xs ">Missed</p>
              </div>
              <div className="p-2 rounded bg-surface-600 dark:bg-transparent border border-border-500 dark:border-border-800">
                <p className="text-sm font-medium text-success-500 dark:text-success-400">
                  ${client.stats.totalSpent}
                </p>
                <p className="text-xs ">Spent</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => navigate(`/dashboard/clients/${client.id}`)}
                className="bg-primary-500 dark:bg-primary-500/60 flex-1 py-2 text-sm text-white rounded-lg hover:bg-primary-600 dark:hover:bg-primary-500/50 cursor-pointer"
              >
                View
              </button>
              <button className="bg-primary-500 dark:bg-primary-500/60 p-2 text-white rounded-lg hover:bg-primary-600 dark:hover:bg-primary-500/50 cursor-pointer">
                <Mail size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
