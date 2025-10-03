import React, { useState } from "react";
import { FaBox, FaTruck, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { Modal, Box, Typography, Button } from "@mui/material";

const OrderReturnProcess = ({ returnDetails, setReturnDetails }) => {
  const [openModal, setOpenModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  if (!returnDetails) {
    return <div>Loading return details...</div>;
  }

  const returnStatus = returnDetails.status;
  const returnType = returnDetails.returnType;

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCancelReturn = async () => {
    setCancelling(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/returns/cancel/${
          returnDetails._id
        }`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Return request cancelled successfully");
        setReturnDetails({
          ...returnDetails,
          status: "cancelled",
          cancelled_at: new Date().toISOString(),
        });
        handleCloseModal();
      } else {
        toast.error(response.data.message || "Failed to cancel return request");
      }
    } catch (error) {
      console.error("Error cancelling return:", error);
      toast.error("Failed to cancel return request");
    } finally {
      setCancelling(false);
    }
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: 400 },
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

  return (
    <div className="bg-white rounded-lg shadow-md border p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 lg:mb-6">
        <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
          Return Status
        </h3>
        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full w-fit">
          {returnType === "refund" ? "Return for Refund" : "Exchange for Size"}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 lg:mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Progress</span>
          <span className="text-sm font-medium text-indigo-600">
            {returnStatus === "submitted"
              ? "20%"
              : returnStatus === "processing"
              ? "40%"
              : returnStatus === "pickup_scheduled"
              ? "60%"
              : returnStatus === "picked_up"
              ? "80%"
              : returnStatus === "completed"
              ? "100%"
              : returnStatus === "cancelled"
              ? "0%"
              : "0%"}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`${
              returnStatus === "cancelled" ? "bg-red-600" : "bg-indigo-600"
            } h-2 rounded-full transition-all duration-300`}
            style={{
              width:
                returnStatus === "submitted"
                  ? "20%"
                  : returnStatus === "processing"
                  ? "40%"
                  : returnStatus === "pickup_scheduled"
                  ? "60%"
                  : returnStatus === "picked_up"
                  ? "80%"
                  : returnStatus === "completed"
                  ? "100%"
                  : returnStatus === "cancelled"
                  ? "100%"
                  : "0%",
            }}
          ></div>
        </div>
      </div>

      {/* Return Status Steps */}
      <div className="space-y-3 lg:space-y-4">
        {[
          {
            key: "submitted",
            label: "Request Submitted",
            icon: FaCheckCircle,
            description: "Your return request has been received",
          },
          {
            key: "processing",
            label: "Request Processing",
            icon: FaBox,
            description: "We're reviewing your return request",
          },
          {
            key: "pickup_scheduled",
            label: "Pickup Scheduled",
            icon: FaTruck,
            description: "A pickup has been scheduled for your items",
          },
          {
            key: "picked_up",
            label: "Items Picked Up",
            icon: FaTruck,
            description: "Your items have been picked up",
          },
          {
            key: "completed",
            label:
              returnType === "refund"
                ? "Refund Processed"
                : "Exchange Completed",
            icon: FaCheckCircle,
            description:
              returnType === "refund"
                ? "Your refund has been processed"
                : "Your exchange items have been shipped",
          },
        ].map((step, index) => {
          const statusOrder = [
            "submitted",
            "processing",
            "pickup_scheduled",
            "picked_up",
            "completed",
          ];
          const currentStepIndex = statusOrder.indexOf(returnStatus);
          const stepIndex = statusOrder.indexOf(step.key);

          const isCompleted =
            stepIndex <= currentStepIndex && returnStatus !== "cancelled";
          const isCurrent = step.key === returnStatus;
          const isUpcoming = stepIndex > currentStepIndex;

          // Skip rendering future steps if cancelled
          if (returnStatus === "cancelled" && isUpcoming) return null;

          const Icon = step.icon;

          return (
            <div key={step.key} className="flex items-start relative">
              {/* Connector Line */}
              {index < statusOrder.length - 1 &&
                returnStatus !== "cancelled" && (
                  <div
                    className={`absolute left-5 lg:left-6 top-8 w-0.5 h-6 lg:h-8 ${
                      isCompleted ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}

              {/* Icon */}
              <div
                className={`flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center z-10 ${
                  returnStatus === "cancelled" && index === 0
                    ? "bg-red-500 text-white"
                    : isCompleted
                    ? "bg-green-500 text-white"
                    : isCurrent
                    ? "bg-indigo-500 text-white ring-4 ring-indigo-100"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {returnStatus === "cancelled" && index === 0 ? (
                  <FaTimesCircle size={16} className="lg:w-5 lg:h-5" />
                ) : (
                  <Icon size={16} className="lg:w-5 lg:h-5" />
                )}
              </div>

              {/* Content */}
              <div className="ml-3 lg:ml-4 pb-4 flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <h4
                    className={`font-semibold text-sm lg:text-base ${
                      returnStatus === "cancelled" && index === 0
                        ? "text-red-800"
                        : isCompleted || isCurrent
                        ? "text-gray-800"
                        : "text-gray-400"
                    }`}
                  >
                    {returnStatus === "cancelled" && index === 0
                      ? "Request Cancelled"
                      : step.label}
                  </h4>
                  {isCurrent && returnStatus !== "cancelled" && (
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full w-fit">
                      Current
                    </span>
                  )}
                  {isCompleted && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full w-fit">
                      Completed
                    </span>
                  )}
                </div>
                <p
                  className={`text-sm mt-1 ${
                    returnStatus === "cancelled" && index === 0
                      ? "text-red-600"
                      : isCompleted || isCurrent
                      ? "text-gray-600"
                      : "text-gray-400"
                  }`}
                >
                  {returnStatus === "cancelled" && index === 0
                    ? "Your return request has been cancelled"
                    : step.description}
                </p>
                {returnDetails[`${step.key}_at`] &&
                  (isCompleted || isCurrent) && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(returnDetails[`${step.key}_at`]).toLocaleString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Return Details */}
      <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-indigo-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium text-indigo-800 text-sm lg:text-base">
            Return Information
          </span>
        </div>

        {returnStatus === "completed" ? (
          <p className="text-sm text-green-700 mt-1">
            {returnType === "refund"
              ? "Your refund has been processed successfully."
              : "Your exchange has been completed successfully."}
          </p>
        ) : returnStatus === "cancelled" ? (
          <p className="text-sm text-red-700 mt-1">
            Your return request has been cancelled.
          </p>
        ) : (
          <p className="text-sm text-indigo-700 mt-1">
            {returnType === "refund"
              ? "Your refund will be processed to your original payment method once the return is complete."
              : "Your exchange items will be shipped once we receive and verify your returned items."}
          </p>
        )}

        {/* Cancel Return Button - Only show for early stages */}
        {(returnStatus === "submitted" || returnStatus === "processing") && (
          <div className="mt-4">
            <button
              onClick={handleOpenModal}
              className="px-4 py-2 bg-white border border-red-500 text-red-600 rounded-md hover:bg-red-50 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <FaTimesCircle size={14} />
              Cancel Return Request
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="cancel-return-modal-title"
        aria-describedby="cancel-return-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography
            id="cancel-return-modal-title"
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontWeight: 600 }}
          >
            Cancel Return Request
          </Typography>
          <Typography id="cancel-return-modal-description" sx={{ mb: 3 }}>
            Are you sure you want to cancel this return request? This action
            cannot be undone.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              onClick={handleCloseModal}
              variant="outlined"
              disabled={cancelling}
            >
              No, Keep Request
            </Button>
            <Button
              onClick={handleCancelReturn}
              variant="contained"
              color="error"
              disabled={cancelling}
              sx={{
                "&.Mui-disabled": {
                  bgcolor: "rgba(211, 47, 47, 0.5)",
                  color: "white",
                },
              }}
            >
              {cancelling ? "Cancelling..." : "Yes, Cancel Return"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default OrderReturnProcess;
