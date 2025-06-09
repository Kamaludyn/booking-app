import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStaff } from "../../hooks/UseStaff";
import { Search, Plus } from "lucide-react";
import PageHeader from "../../components/PageHeader";

export default function StaffList() {
  const [search, setSearch] = useState("");
  const staff = useStaff();
  const navigate = useNavigate();

  const filteredStaff = staff.filter(
    (member) =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff Members"
        subtitle={`${filteredStaff.length} staff found`}
        actionLabel="New Staff"
        onActionClick={() => navigate("/dashboard/staff/new")}
        actionIcon={Plus}
        isButton
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-400" />
        <input
          type="text"
          placeholder="Search staff..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-500 dark:bg-surface-800 border border-border-500 dark:border-border-800 text-text-500 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none focus:border-transparent shadow-sm hover:shadow-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((member) => (
          <div
            key={member.id}
            className="p-4 rounded-lg bg-surface-500 dark:bg-surface-800 border border-border-500 dark:border-border-800 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 font-medium">
                {member.name.charAt(0)}
              </div>
              <div>
                <h3
                  className="font-medium text-text-500 dark:text-white hover:underline cursor-pointer"
                  onClick={() => navigate(`/dashboard/staff/${member.id}`)}
                >
                  {member.name}
                </h3>
                <p className="text-xs text-text-400 dark:text-text-600">
                  {member.role}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm mb-2">
              <div className="flex items-center gap-2 text-text-400 dark:text-text-600">
                <span>Email:</span>
                <span>{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-text-400 dark:text-text-600">
                <span>Phone:</span>
                <span>{member.phone || "Not set"}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-auto text-white">
              <button
                onClick={() => navigate(`/dashboard/staff/${member.id}/edit`)}
                className="flex-1 py-2 text-sm rounded-lg bg-primary-500 hover:bg-primary-600 dark:bg-primary-500/60 dark:hover:bg-primary-500/70 cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => navigate(`/dashboard/staff/${member.id}`)}
                className="flex-1 py-2 text-sm rounded-lg bg-primary-500 hover:bg-primary-600 dark:bg-primary-500/60 dark:hover:bg-primary-500/70 cursor-pointer"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredStaff.length === 0 && (
        <div className="text-center py-8 bg-surface-500 dark:bg-surface-800 rounded-lg">
          <p className="text-text-400 dark:text-text-600">
            No staff members found
          </p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-primary-500 hover:underline text-sm mt-2"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
}
