import { useState } from "react";
import PaymentMethodForm from "../../components/PaymentMethodForm";
import PageHeader from "../../components/PageHeader";
import { Plus } from "lucide-react";
import { useMethods } from "../../hooks/UseMethods";

const PaymentMethods = () => {
  const mockMethods = useMethods();
  const [methods, setMethods] = useState(mockMethods || []);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleToggle = (id) => {
    setMethods((prev) =>
      prev.map((method) =>
        method.id === id ? { ...method, enabled: !method.enabled } : method
      )
    );
  };

  const handleDelete = (id) => {
    setMethods((prev) => prev.filter((method) => method.id !== id));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Methods"
        actionLabel="Add Payment Method"
        onActionClick={() => setShowAddForm(true)}
        actionIcon={Plus}
        isButton
      />

      {methods.length === 0 && !showAddForm && (
        <div className="text-center py-12 border-2 border-dashed border-border-300 dark:border-border-700 rounded-2xl text-text-400">
          No payment methods added yet
        </div>
      )}

      {methods.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {methods.map((method) => (
            <div
              key={method.id}
              className={`bg-surface-500 dark:bg-surface-800 p-4 rounded-2xl border border-border-500 dark:border-border-800 shadow-sm hover:shadow-md transition-all ${
                !method.enabled ? "opacity-50" : ""
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-text-600 dark:text-white">
                    {method.name}
                  </h3>
                  <p className="text-sm text-text-400 break-words">
                    {Object.entries(method.details)
                      .map(([key, val]) => `${key}: ${val}`)
                      .join(" | ")}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(method.id)}
                  className="text-red-500 text-sm hover:text-red-600"
                >
                  Delete
                </button>
              </div>

              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-text-400">
                  {method.enabled ? "Enabled" : "Disabled"}
                </span>
                <button
                  onClick={() => handleToggle(method.id)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors flex items-center ${
                    method.enabled
                      ? "bg-primary-500 justify-end"
                      : "bg-background-800 justify-start"
                  }`}
                >
                  <span className="block w-4 h-4 rounded-full bg-surface-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddForm && (
        <PaymentMethodForm
          onClose={() => setShowAddForm(false)}
          onSave={(newMethod) => {
            setMethods([...methods, newMethod]);
            setShowAddForm(false);
          }}
        />
      )}
    </div>
  );
};

export default PaymentMethods;

// import { useState } from "react";
// import PaymentMethodForm from "../../components/PaymentMethodForm";
// import PageHeader from "../../components/PageHeader";
// import { Plus } from "lucide-react";

// const PaymentMethods = () => {
//   const [methods, setMethods] = useState([]);
//   const [showAddForm, setShowAddForm] = useState(false);

//   const handleToggle = (id) => {
//     setMethods((prev) =>
//       prev.map((method) =>
//         method.id === id ? { ...method, enabled: !method.enabled } : method
//       )
//     );
//   };

//   const handleDelete = (id) => {
//     setMethods((prev) => prev.filter((method) => method.id !== id));
//   };

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="Payment Methods"
//         actionLabel="Add Payment Method"
//         onActionClick={() => setShowAddForm(true)}
//         actionIcon={Plus}
//         isButton
//       />

//       {methods.length === 0 && !showAddForm && (
//         <div className="text-center py-12 border-2 border-dashed border-border-300 dark:border-border-700 rounded-2xl text-text-400">
//           No payment methods added yet
//         </div>
//       )}

//       {methods.length > 0 && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {methods.map((method) => (
//             <div
//               key={method.id}
//               className={`bg-surface-500 dark:bg-surface-800 p-4 rounded-2xl border border-border-500 dark:border-border-800 shadow-sm hover:shadow-md transition-all ${
//                 !method.enabled ? "opacity-50" : ""
//               }`}
//             >
//               <div className="flex justify-between items-start mb-3">
//                 <div>
//                   <h3 className="text-lg font-semibold text-text-600 dark:text-white">
//                     {method.name}
//                   </h3>
//                   <p className="text-sm text-text-400 break-words">
//                     {Object.entries(method.details)
//                       .map(([key, val]) => `${key}: ${val}`)
//                       .join(" | ")}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => handleDelete(method.id)}
//                   className="text-red-500 text-sm hover:text-red-600"
//                 >
//                   Delete
//                 </button>
//               </div>

//               <div className="flex justify-between items-center mt-2">
//                 <span
//                   className={`text-sm font-medium ${
//                     method.enabled ? "text-green-600" : "text-gray-400"
//                   }`}
//                 >
//                   {method.enabled ? "Enabled" : "Disabled"}
//                 </span>

//                 <label className="inline-flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={method.enabled}
//                     onChange={() => handleToggle(method.id)}
//                     className="sr-only"
//                   />
//                   <div className="w-10 h-5 bg-border-400 dark:bg-border-600 rounded-full peer transition duration-300 relative border">
//                     <div
//                       className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
//                         method.enabled ? "translate-x-5" : ""
//                       }`}
//                     ></div>
//                   </div>
//                 </label>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {showAddForm && (
//         <PaymentMethodForm
//           onClose={() => setShowAddForm(false)}
//           onSave={(newMethod) => {
//             setMethods([...methods, newMethod]);
//             setShowAddForm(false);
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default PaymentMethods;
