import { useState, useEffect } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import { GiReturnArrow } from "react-icons/gi";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { toast } from "react-toastify";

const PincodeChecker = ({
  deliveryDays = 4,
  setIsDeliverable,
  inStock = true,
  requiresSize = false,
}) => {
  const [pincode, setPincode] = useState("");
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const savedPin = localStorage.getItem("checkedPincode");
    const savedDelivery = localStorage.getItem("isDeliverable") === "true";

    if (savedPin && savedDelivery && inStock) {
      setPincode(savedPin);
      setIsDeliverable(true);
      setHasChecked(true);
      setDeliveryAvailable(true);
      setShowDetails(true);

      const estimatedDate = new Date();
      estimatedDate.setDate(estimatedDate.getDate() + deliveryDays);

      const formattedDate = estimatedDate.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });

      setDeliveryDate(formattedDate);
    }
  }, [deliveryDays, setIsDeliverable, inStock]);

  const checkDelivery = () => {
    setErrorMessage("");

    // ✅ Only do size validation if size is required
    if (requiresSize) {
      if (inStock === null) {
        toast.error("Please select a size first.");
        return;
      }

      if (inStock === false) {
        toast.error(
          "Selected size is out of stock. Please select an available size."
        );
        return;
      }
    }

    if (!/^\d{6}$/.test(pincode)) {
      setIsDeliverable(false);
      setDeliveryAvailable(false);
      setShowDetails(false);
      setHasChecked(false);
      setErrorMessage("❌ Please enter a valid 6-digit pin code.");
      return;
    }

    const serviceablePincodes = ["752021", "560001", "400001", "700001"];

    if (serviceablePincodes.includes(pincode)) {
      const estimatedDate = new Date();
      estimatedDate.setDate(estimatedDate.getDate() + deliveryDays);

      const formattedDate = estimatedDate.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });

      setDeliveryDate(formattedDate);
      setIsDeliverable(true);
      setDeliveryAvailable(true);
      setShowDetails(true);
      setHasChecked(true);

      localStorage.setItem("checkedPincode", pincode);
      localStorage.setItem("isDeliverable", "true");
    } else {
      setDeliveryAvailable(false);
      setShowDetails(false);
      setHasChecked(true);
      setErrorMessage("❌ Delivery not available to this pin code.");
      setIsDeliverable(false);

      localStorage.removeItem("checkedPincode");
      localStorage.setItem("isDeliverable", "false");
    }
  };

  const handleChangePincode = () => {
    setPincode("");
    setShowDetails(false);
    setErrorMessage("");
    setHasChecked(false);
    setIsDeliverable(null);
    setDeliveryDate("");

    localStorage.removeItem("checkedPincode");
    localStorage.removeItem("isDeliverable");
  };

  return (
    <div className="mt-6">
      {/* Label and input */}
      <div className="flex items-center gap-1 mb-2">
        <IoLocationOutline className="text-gray-600 text-lg mt-[2px]" />
        <label className="text-sm font-medium text-gray-700">
          Enter Pin-code to check delivery
        </label>
      </div>

      <div className="flex items-center gap-2 w-full max-w-md">
        <input
          type="tel"
          maxLength={6}
          value={pincode}
          onChange={(e) => {
            // Only allow digits and limit length to 6
            const value = e.target.value.replace(/\D/g, "").slice(0, 6);
            setPincode(value);
          }}
          placeholder="Enter Pin-code"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
        />

        {!hasChecked ? (
          <button
            onClick={() => {
              if (requiresSize && inStock === null) {
                toast.error("Please select a size first.");
                return;
              }
              checkDelivery();
            }}
            className="px-4 py-2 rounded-md text-sm font-medium transition text-white bg-[#2874f0] hover:bg-[#185cd8]"
          >
            Check
          </button>
        ) : (
          <button
            onClick={handleChangePincode}
            className="px-4 py-2 bg-[#2874f0] hover:bg-[#185cd8] text-white rounded-md text-sm font-medium transition"
          >
            Change Pincode
          </button>
        )}
      </div>

      {/* Error message */}
      {errorMessage && (
        <p className="mt-2 text-sm text-red-600 font-medium">{errorMessage}</p>
      )}

      {/* Delivery info */}
      {showDetails && (inStock === true || !requiresSize) && (
        <div className="mt-3 space-y-2">
          <p className="text-sm font-medium text-green-600">
            ✅ Delivery available. Estimated delivery:
          </p>

          <div className="flex items-center gap-2 text-sm text-black ml-2">
            <TbTruckDelivery className="text-lg" />
            <span>{deliveryDate}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-black ml-2">
            <GiReturnArrow className="text-lg" />
            <span>7 days return policy</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-black ml-2">
            <RiMoneyRupeeCircleLine className="text-lg" />
            <span>
              Cash on delivery is not available. Only online payment mode.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PincodeChecker;
