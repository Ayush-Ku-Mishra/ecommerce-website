import React from "react";

const STATUS_STEPS = [
  { key: "placed", label: "Order Placed" },
  { key: "shipped", label: "Order Shipped" },
  { key: "in_transit", label: "In Transit" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

// Helper to get current step index for highlighting
function getCurrentStepIndex(currentStatus) {
  const idx = STATUS_STEPS.findIndex((s) => s.key === currentStatus);
  return idx === -1 ? 0 : idx;
}

// The component accepts current status and dates as props for flexibility
const OrderStatusTracker = ({ statusDates, currentStatus }) => {
  // If props not passed, fallback to these example values (optional)
  const fallbackStatusDates = {
    placed: "2024-07-01",
    shipped: "2024-07-02",
    in_transit: "2024-07-04",
    out_for_delivery: null,
    delivered: null,
  };
  const fallbackCurrentStatus = "out_for_delivery";

  const dates = statusDates || fallbackStatusDates;
  const current = currentStatus || fallbackCurrentStatus;

  const currentIdx = getCurrentStepIndex(current);

  return (
    <div className="flex flex-col gap-0 p-6 pl-6 relative border border-gray-300">
      {STATUS_STEPS.map((step, idx) => {
        const isCompleted = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const isLast = idx === STATUS_STEPS.length - 1;
        const date =
          dates[step.key] && (
            <div className="text-xs mt-1 text-gray-500 font-medium">
              {new Date(dates[step.key]).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          );

        return (
          <div key={step.key} className="flex items-start relative">
            {/* Circle step indicator */}
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center z-10
                ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isCurrent
                    ? "bg-blue-600 text-white ring-2 ring-blue-300"
                    : "bg-gray-300 text-white"
                }
              `}
            >
              {isCompleted || isCurrent ? (
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="10" fill="currentColor" />
                  <path d="M6 10l3 3.5 5-5" stroke="#fff" strokeWidth="2" fill="none" />
                </svg>
              ) : (
                <span className="w-2 h-2 bg-white rounded-full block" />
              )}
            </span>

            {/* Vertical line */}
            {!isLast && (
              <span
                className={`absolute left-[9px] top-5 w-px h-[40px] ${
                  isCompleted ? "bg-green-400" : "bg-gray-200"
                }`}
              />
            )}

            {/* Label and date */}
            <div className="ml-4 mt-[1px] mb-3">
              <div
                className={`text-[16px] font-semibold ${
                  isCompleted || isCurrent ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {step.label}
              </div>
              {date}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatusTracker;
