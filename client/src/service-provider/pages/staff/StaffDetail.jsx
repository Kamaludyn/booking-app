import { useParams, useNavigate } from "react-router-dom";
import { useStaffId } from "../../hooks/UseStaff";
import { ArrowLeft, Mail, Phone, User, Calendar } from "lucide-react";

export default function StaffDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const staff = useStaffId(id);

  if (!staff) {
    return (
      <div className="text-center py-8 text-text-400 dark:text-text-600">
        Staff member not found
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-text-400 hover:text-primary-500 p-1"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-semibold text-text-500 dark:text-white">
            Staff Details
          </h1>
        </div>

        <div className="bg-surface-500 dark:bg-surface-800 rounded-lg border border-border-500 dark:border-border-800 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border-500 dark:border-border-800">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 font-medium text-2xl">
                {staff.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-500 dark:text-white">
                  {staff.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  {/* <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(
                      staff.status
                    )}`}
                  >
                    {capitalize(staff.status)}
                  </span> */}
                  <span className="text-xs px-2 py-1 rounded-full bg-surface-600 dark:bg-surface-700 text-text-500 dark:text-text-300">
                    {capitalize(staff.role)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailCard
                icon={
                  <Mail
                    size={16}
                    className="text-text-400 dark:text-text-600"
                  />
                }
                label="Email"
                value={staff.email}
              />
              <DetailCard
                icon={
                  <Phone
                    size={16}
                    className="text-text-400 dark:text-text-600"
                  />
                }
                label="Phone"
                value={staff.phone || "Not provided"}
              />
              <DetailCard
                icon={
                  <User
                    size={16}
                    className="text-text-400 dark:text-text-600"
                  />
                }
                label="Role"
                value={capitalize(staff.role)}
              />
              <DetailCard
                icon={
                  <Calendar
                    size={16}
                    className="text-text-400 dark:text-text-600"
                  />
                }
                label="Joined On"
                value={new Date(staff.joinDate).toLocaleDateString()}
              />
            </div>

            {staff.notes && (
              <div>
                <h3 className="font-medium text-text-500 dark:text-white mb-2">
                  Notes
                </h3>
                <p className="text-sm text-text-400 dark:text-text-600 bg-surface-600 dark:bg-surface-700 p-3 rounded-lg">
                  {staff.notes}
                </p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-border-500 dark:border-border-800 flex justify-end gap-3">
            <button
              onClick={() => navigate(`/dashboard/staff/${staff.id}/edit`)}
              className="px-4 py-2 rounded-lg border border-border-500 dark:border-border-800 text-text-500 dark:text-white dark:bg-surface-700 dark:hover:bg-transparent cursor-pointer"
            >
              Edit Staff
            </button>
            <button className="px-4 py-2 rounded-lg bg-danger-500 hover:bg-danger-800 text-white">
              Delete staff
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function DetailCard({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1">{icon}</div>
      <div>
        <p className="text-sm text-text-400 dark:text-text-600">{label}</p>
        <p className="text-text-500 dark:text-white font-medium">{value}</p>
      </div>
    </div>
  );
}

function capitalize(word) {
  return word?.charAt(0).toUpperCase() + word?.slice(1);
}
