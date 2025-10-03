import { useState, useEffect } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import { GiReturnArrow } from "react-icons/gi";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import toast from "react-hot-toast";
import axios from "axios";
import { CircularProgress } from "@mui/material";

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
  const [loadingPincode, setLoadingPincode] = useState(false);
  const [locationInfo, setLocationInfo] = useState(null);

  // Comprehensive Odisha district data with their pincode ranges and delivery times
  const odishaDistricts = {
    "Angul": { deliveryDays: 4 },
    "Balangir": { deliveryDays: 4 },
    "Balasore": { deliveryDays: 4 },
    "Bargarh": { deliveryDays: 4 },
    "Bhadrak": { deliveryDays: 4 },
    "Boudh": { deliveryDays: 4 },
    "Cuttack": { deliveryDays: 3 },
    "Deogarh": { deliveryDays: 5 },
    "Dhenkanal": { deliveryDays: 4 },
    "Gajapati": { deliveryDays: 5 },
    "Ganjam": { deliveryDays: 5 },
    "Jagatsinghpur": { deliveryDays: 4 },
    "Jajpur": { deliveryDays: 4 },
    "Jharsuguda": { deliveryDays: 5 },
    "Kalahandi": { deliveryDays: 5 },
    "Kandhamal": { deliveryDays: 5 },
    "Kendrapara": { deliveryDays: 4 },
    "Kendujhar": { deliveryDays: 5 },
    "Khordha": { deliveryDays: 3 },
    "Koraput": { deliveryDays: 5 },
    "Malkangiri": { deliveryDays: 6 },
    "Mayurbhanj": { deliveryDays: 5 },
    "Nabarangpur": { deliveryDays: 6 },
    "Nayagarh": { deliveryDays: 4 },
    "Nuapada": { deliveryDays: 5 },
    "Puri": { deliveryDays: 3 },
    "Rayagada": { deliveryDays: 5 },
    "Sambalpur": { deliveryDays: 4 },
    "Subarnapur": { deliveryDays: 5 },
    "Sundargarh": { deliveryDays: 5 }
  };

  // Special areas with faster delivery
  const specialAreas = {
    "Bhubaneswar": { deliveryDays: 2, district: "Khordha" },
    "Cuttack City": { deliveryDays: 3, district: "Cuttack" }
  };

  // Odisha pincode prefixes - most Odisha pincodes start with these
  const odishaPrefixes = ["751", "752", "753", "754", "755", "756", "757", "758", "759", "760", "761", "762", "764", "765", "766", "767", "768", "769", "770"];

  // District name normalizations
  const districtNormalizations = {
    "Khorda": "Khordha",
    "Khurda": "Khordha",
    "Sundergarh": "Sundargarh",
    "Sonepur": "Subarnapur",
    "Keonjhar": "Kendujhar"
  };

  useEffect(() => {
    const savedPin = localStorage.getItem("checkedPincode");
    const savedDelivery = localStorage.getItem("isDeliverable") === "true";
    const savedLocation = localStorage.getItem("pincodeLocation");

    if (savedPin && savedDelivery && inStock) {
      setPincode(savedPin);
      setIsDeliverable(true);
      setHasChecked(true);
      setDeliveryAvailable(true);
      setShowDetails(true);
      
      if (savedLocation) {
        try {
          setLocationInfo(JSON.parse(savedLocation));
        } catch (e) {
          console.error("Error parsing saved location", e);
        }
      }

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

  // Check if a pincode is likely in Odisha based on prefix
  const isPincodeInOdisha = (pin) => {
    return odishaPrefixes.some(prefix => pin.startsWith(prefix));
  };

  // Normalize district names
  const normalizeDistrict = (district) => {
    return districtNormalizations[district] || district;
  };

  // Get delivery days for a district/area
  const getDeliveryDays = (district, area) => {
    // Check if it's a special area with faster delivery
    for (const [specialArea, data] of Object.entries(specialAreas)) {
      if (area.toLowerCase().includes(specialArea.toLowerCase())) {
        return data.deliveryDays;
      }
    }
    
    // If not a special area, use district delivery time
    const normalizedDistrict = normalizeDistrict(district);
    return odishaDistricts[normalizedDistrict]?.deliveryDays || 4; // Default to 4 days
  };

  const fetchPincodeDetails = async (pin) => {
    if (!pin || pin.length !== 6) return null;
    
    setLoadingPincode(true);
    
    try {
      // First do a quick check if this is likely an Odisha pincode
      const likelyInOdisha = isPincodeInOdisha(pin);
      
      // Try the postal API
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pin}`);
      
      if (response.data && response.data[0]?.Status === "Success" && response.data[0]?.PostOffice?.length > 0) {
        const postOffice = response.data[0].PostOffice[0];
        const normalizedDistrict = normalizeDistrict(postOffice.District);
        
        // Get appropriate delivery days based on district and area
        const daysToDeliver = getDeliveryDays(normalizedDistrict, postOffice.Name);
        
        return {
          district: normalizedDistrict,
          state: postOffice.State,
          area: postOffice.Name,
          deliveryDays: daysToDeliver,
          isInOdisha: postOffice.State === "Odisha" || likelyInOdisha
        };
      }
      
      // If API failed but pincode looks like Odisha, assume it's in Odisha with default delivery time
      if (likelyInOdisha) {
        return {
          district: "Unknown District",
          state: "Odisha",
          area: "Unknown",
          deliveryDays: 5, // Conservative estimate for unknown areas
          isInOdisha: true
        };
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching pincode details:", error);
      
      // Fallback for API failure: If pincode looks like Odisha, assume it's in Odisha
      if (isPincodeInOdisha(pin)) {
        return {
          district: "Unknown District",
          state: "Odisha",
          area: "Unknown",
          deliveryDays: 5, // Conservative estimate for unknown areas
          isInOdisha: true
        };
      }
      
      return null;
    } finally {
      setLoadingPincode(false);
    }
  };

  const checkDelivery = async () => {
    setErrorMessage("");

    // Size validation if required
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

    // Get location data
    const location = await fetchPincodeDetails(pincode);
    
    if (!location) {
      setIsDeliverable(false);
      setDeliveryAvailable(false);
      setShowDetails(false);
      setHasChecked(true);
      setErrorMessage("❌ Invalid pincode or location not found.");
      return;
    }
    
    setLocationInfo(location);
    
    // Check if delivery is available - we deliver everywhere in Odisha
    if (location.state === "Odisha" || location.isInOdisha) {
      const estimatedDate = new Date();
      estimatedDate.setDate(estimatedDate.getDate() + location.deliveryDays);

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
      localStorage.setItem("pincodeLocation", JSON.stringify(location));
    } else {
      setDeliveryAvailable(false);
      setShowDetails(false);
      setHasChecked(true);
      
      // We only don't deliver outside Odisha
      setErrorMessage(`❌ Sorry, we don't deliver to ${location.state}. We currently only deliver within Odisha.`);
      
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
    setLocationInfo(null);

    localStorage.removeItem("checkedPincode");
    localStorage.removeItem("isDeliverable");
    localStorage.removeItem("pincodeLocation");
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
        <div className="relative flex-1">
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          />
          {loadingPincode && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <CircularProgress size={16} />
            </div>
          )}
        </div>

        {!hasChecked ? (
          <button
            onClick={() => {
              if (requiresSize && inStock === null) {
                toast.error("Please select a size first.");
                return;
              }
              checkDelivery();
            }}
            disabled={loadingPincode}
            className={`px-4 py-2 rounded-md text-sm font-medium transition text-white ${
              loadingPincode ? "bg-blue-400" : "bg-[#2874f0] hover:bg-[#185cd8]"
            }`}
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

      {/* Location info if available */}
      {locationInfo && hasChecked && deliveryAvailable && (
        <p className="mt-2 text-sm text-gray-600">
          Delivering to: {locationInfo.area}, {locationInfo.district}, {locationInfo.state}
        </p>
      )}

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