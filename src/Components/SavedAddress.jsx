import React, { useState, useEffect } from "react";
import AccountDetailsSection from "./AccountDetailsSection";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import TextField from "@mui/material/TextField";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { BiCurrentLocation } from "react-icons/bi";
import toast from "react-hot-toast";
import axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const emptyAddress = {
  name: "",
  phone: "",
  address_line: "",
  pincode: "",
  locality: "",
  city: "",
  state: "",
  landmark: "",
  alternatePhone: "",
  type: "Home",
  isDefault: false,
};

const SavedAddress = () => {
  // Local state only - no Redux
  const [addresses, setAddresses] = useState([]);

  // Modal state for add/edit
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState(emptyAddress);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load addresses from backend on mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      console.log(
        "Fetching addresses from:",
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/address/addAddress`
      );

      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/address/addAddress`,
        { withCredentials: true }
      );

      console.log("API Response:", data);

      if (data.success && data.addresses) {
        setAddresses(data.addresses);
        console.log("Addresses loaded successfully:", data.addresses);
      } else {
        console.error("API returned success=false:", data);
        toast.error(data.message || "Failed to load addresses");
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      console.error("Error response:", error.response?.data);
      toast.error(
        `Error fetching addresses: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setForm({
      ...emptyAddress,
      isDefault: addresses.length === 0, // first address = default
    });
    setOpen(true);
  };

  const handleOpenEdit = (addr) => {
    setIsEdit(true);
    setForm({
      ...addr,
      isDefault: addr.isDefault || addr.default || false,
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Use browser geolocation and reverse geocode
  const useMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const address = data.address || {};
          setForm((prev) => ({
            ...prev,
            locality:
              address.suburb || address.neighbourhood || address.road || "",
            address_line: `${
              address.suburb ||
              address.neighbourhood ||
              address.road ||
              address.village ||
              ""
            }, ${
              address.locality || address.town || address.city || ""
            }`.trim(),
            city: address.city || address.town || address.village || "",
            state: address.state || "",
            pincode: address.postcode || "",
          }));
        } catch (error) {
          alert("Failed to fetch address from your location");
          console.error(error);
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        alert("Unable to retrieve your location: " + error.message);
        setLoadingLocation(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address_line || !form.pincode) {
      toast.error("Please fill all required fields");
      return;
    }

    setSaving(true);

    // Prepare form data with both field names for backend compatibility
    const formData = {
      ...form,
      default: form.isDefault, // Map isDefault to default for backend
    };

    try {
      if (isEdit && form._id) {
        // Edit Address API call
        const { data } = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/address/update/${
            form._id
          }`,
          formData,
          { withCredentials: true }
        );
        if (data.success) {
          // Update local state
          setAddresses((prevAddresses) =>
            prevAddresses.map((addr) =>
              addr._id === form._id ? data.address : addr
            )
          );
          toast.success("Address updated");
          setOpen(false);
          return;
        } else {
          toast.error(data.message || "Failed to update address");
        }
      } else {
        // Add Address API call
        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/address/addAddress`,
          formData,
          { withCredentials: true }
        );
        if (data.success) {
          // Add to local state
          setAddresses((prevAddresses) => [...prevAddresses, data.address]);
          toast.success("Address added");
          setOpen(false);
          return;
        } else {
          toast.error(data.message || "Failed to add address");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error, try again later");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/address/delete/${id}`,
        { withCredentials: true }
      );
      if (data.success) {
        // Remove from local state
        setAddresses((prevAddresses) =>
          prevAddresses.filter((addr) => addr._id !== id)
        );
        toast.info("Address deleted");
      } else {
        toast.error(data.message || "Failed to delete address");
      }
    } catch (error) {
      toast.error("Server error, try again later");
    }
  };

  const handleDefault = async (id) => {
    try {
      const { data } = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/address/${id}/default`,
        {},
        { withCredentials: true }
      );

      if (data.success) {
        // Update local state - set all addresses to non-default, then set the selected one as default
        setAddresses((prevAddresses) =>
          prevAddresses.map((addr) => ({
            ...addr,
            isDefault: addr._id === id,
            default: addr._id === id,
          }))
        );
        toast.success("Default address set");
      } else {
        toast.error(data.message || "Failed to set default address");
      }
    } catch (error) {
      console.error("Set default address error:", error);
      toast.error("Server error, try again later");
    }
  };

  if (loadingAddresses) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-white z-50">
        <CircularProgress size={60} thickness={4} />
      </div>
    );
  }

  return (
    <div>
      {/* Mobile Layout */}
      <div className="block md:hidden m-1 px-1 py-2">
        <div className="bg-white">
          <p className="text-xl font-semibold mb-4">Address</p>

          {/* Add Address Button */}
          <div
            onClick={handleOpenAdd}
            className="p-3 cursor-pointer text-center border-2 border-[#22B6FC] border-dashed bg-[#f1faff] hover:bg-[#e5f5fb] rounded-md font-semibold transition mb-4"
          >
            <button>
              <span className="text-lg">+</span> ADD ADDRESS
            </button>
          </div>

          {/* List all addresses */}
          <div>
            {addresses.map((addr) => (
              <div
                key={addr._id}
                className="bg-white border border-[#e5e7eb] shadow-md rounded-lg p-4 mb-4"
                style={{
                  boxShadow: "0 2px 12px 0 #eef6fa",
                }}
              >
                {/* Address Tag & Default */}
                <div className="mb-3">
                  <div className="inline-flex items-center gap-2">
                    <span className="px-3 py-1 text-xs font-semibold bg-[#e5f5fb] text-[#22B6FC] rounded-full uppercase">
                      {addr.type}
                    </span>
                    {(addr.isDefault || addr.default) && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 font-bold rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                </div>

                {/* Address Details */}
                <div className="mb-3">
                  <div className="mb-2">
                    <span className="font-bold text-gray-900 text-base block">
                      {addr.name}
                    </span>
                    <span className="text-gray-700 font-medium text-sm">
                      {addr.phone}
                    </span>
                  </div>
                  <div className="text-gray-700 text-sm leading-relaxed mb-1 break-words">
                    {addr.address_line}, {addr.locality}, {addr.city},{" "}
                    {addr.state}
                  </div>
                  <div className="text-gray-500 text-sm">
                    Pincode: {addr.pincode}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded hover:border-blue-400 text-blue-500 text-sm font-semibold"
                    onClick={() => handleOpenEdit(addr)}
                  >
                    <FiEdit2 size={14} /> Edit
                  </button>
                  <button
                    className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded hover:border-red-400 text-red-500 text-sm font-semibold"
                    onClick={() => handleDelete(addr._id)}
                  >
                    <FiTrash2 size={14} /> Delete
                  </button>
                  {!(addr.isDefault || addr.default) && (
                    <button
                      className="px-3 py-2 border rounded border-green-200 text-green-600 text-sm font-semibold"
                      onClick={() => handleDefault(addr._id)}
                    >
                      Set as Default
                    </button>
                  )}
                </div>
              </div>
            ))}
            {addresses.length === 0 && (
              <div className="text-sm text-gray-500 mt-4 text-center">
                No addresses saved yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="flex gap-10 ml-10 mt-2 mb-8 max-w-[1190px]">
          <div className="flex-shrink-0 min-w-[20%] w-auto sticky top-28 self-start">
            <AccountDetailsSection />
          </div>

          <div className="w-[80%] border-2 shadow mt-5 rounded-xl bg-white p-5">
            <p className="text-[20px] font-semibold">Address</p>
            {/* Add Address Button */}
            <div
              onClick={handleOpenAdd}
              className="p-3 cursor-pointer text-center border-2 border-[#22B6FC] border-dashed mt-3 bg-[#f1faff] hover:bg-[#e5f5fb] rounded-md font-semibold transition mb-6"
            >
              <button>
                <span className="text-[22px]">+</span> ADD ADDRESS
              </button>
            </div>

            {/* List all addresses */}
            <div>
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  className="flex items-start gap-3 bg-white border border-[#e5e7eb] shadow-md rounded-lg px-5 py-4 mb-4"
                  style={{
                    boxShadow: "0 2px 12px 0 #eef6fa",
                  }}
                >
                  {/* Address Tag & Default */}
                  <div className="mr-4 mt-1">
                    <div className="px-3 py-[3px] text-xs font-semibold bg-[#e5f5fb] text-[#22B6FC] rounded-full uppercase">
                      {addr.type}
                      {(addr.isDefault || addr.default) && (
                        <span className="ml-2 px-2 py-[1.5px] text-[11px] bg-green-100 text-green-700 font-bold rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Address Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex gap-4 items-center">
                      <span className="font-bold text-gray-900 text-[16px]">
                        {addr.name}
                      </span>
                      <span className="text-gray-700 font-semibold text-[15px]">
                        {addr.phone}
                      </span>
                    </div>
                    <div className="text-gray-700 text-[15px] leading-relaxed mb-1 break-words">
                      {addr.address_line}, {addr.locality},{addr.city},{" "}
                      {addr.state}
                    </div>
                    <div className="text-gray-500 text-[15px] mb-2">
                      Pincode: {addr.pincode}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-1">
                      <button
                        className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded hover:border-blue-400 text-blue-500 text-sm font-semibold"
                        onClick={() => handleOpenEdit(addr)}
                      >
                        <FiEdit2 size={16} /> Edit
                      </button>
                      <button
                        className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded hover:border-red-400 text-red-500 text-sm font-semibold"
                        onClick={() => handleDelete(addr._id)}
                      >
                        <FiTrash2 size={16} /> Delete
                      </button>
                      {!(addr.isDefault || addr.default) && (
                        <button
                          className="text-xs px-3 py-1 border rounded border-green-200 text-green-600 ml-2 font-semibold"
                          onClick={() => handleDefault(addr._id)}
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {addresses.length === 0 && (
                <div className="text-sm text-gray-500 mt-2 pl-4">
                  No addresses saved yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal - Responsive for both mobile and desktop */}
      {open && (
        <div className="fixed inset-0 lg:mt-32 bg-black bg-opacity-20 flex items-center justify-center z-40 md:p-4">
          <Backdrop
            sx={{
              color: "#fff",
              zIndex: (theme) => theme.zIndex.modal + 1,
            }}
            open={saving}
          >
            <CircularProgress color="inherit" />
          </Backdrop>

          <form
            className="bg-white md:rounded-xl p-4 md:p-8 md:shadow-xl w-full md:max-w-3xl h-full md:h-auto md:max-h-[90vh] overflow-y-auto scrollbar-hide"
            onSubmit={handleSubmit}
          >
            <h2 className="text-lg font-bold mb-4">
              {isEdit ? "Edit Address" : "Add Address"}
            </h2>

            <button
              type="button"
              onClick={useMyLocation}
              disabled={loadingLocation}
              className="mb-3 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition flex items-center gap-2 w-full md:w-auto"
            >
              <BiCurrentLocation className="text-lg" />
              {loadingLocation
                ? "Detecting Location..."
                : "Use My Current Location"}
            </button>
            <div className="mb-3">
              <div className="flex flex-col md:flex-row gap-3 mb-3">
                <TextField
                  name="name"
                  label="Full Name"
                  variant="outlined"
                  fullWidth
                  required
                  value={form.name}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "4px",
                    },
                    "& .MuiOutlinedInput-input": {
                      padding: "12px 16px",
                      fontSize: "1rem",
                    },
                  }}
                />
                <TextField
                  name="phone"
                  label="10-digit mobile number"
                  variant="outlined"
                  fullWidth
                  required
                  inputProps={{
                    maxLength: 10,
                    pattern: "[6-9][0-9]{9}",
                    title:
                      "Enter a valid 10-digit Indian mobile number starting with 6-9",
                  }}
                  value={form.phone}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "4px",
                    },
                    "& .MuiOutlinedInput-input": {
                      padding: "12px 16px",
                      fontSize: "1rem",
                    },
                  }}
                />
              </div>
              <div className="flex flex-col md:flex-row gap-3 mb-3">
                <TextField
                  name="pincode"
                  label="Pincode"
                  variant="outlined"
                  required
                  value={form.pincode}
                  onChange={handleChange}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "4px",
                    },
                    "& .MuiOutlinedInput-input": {
                      padding: "12px 16px",
                      fontSize: "1rem",
                    },
                  }}
                />
                <TextField
                  name="locality"
                  label="Locality"
                  variant="outlined"
                  required
                  value={form.locality}
                  onChange={handleChange}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "4px",
                    },
                    "& .MuiOutlinedInput-input": {
                      padding: "12px 16px",
                      fontSize: "1rem",
                    },
                  }}
                />
              </div>

              <TextField
                name="address_line"
                label="Address (Area and Street)"
                variant="outlined"
                required
                fullWidth
                multiline
                rows={2}
                value={form.address_line}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "4px",
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "12px 16px",
                    fontSize: "1rem",
                  },
                }}
                className="!mb-3"
              />

              <div className="flex flex-col md:flex-row gap-3 mb-3">
                <TextField
                  name="city"
                  label="City / District / Town"
                  variant="outlined"
                  required
                  fullWidth
                  value={form.city}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "4px",
                    },
                    "& .MuiOutlinedInput-input": {
                      padding: "12px 16px",
                      fontSize: "1rem",
                    },
                  }}
                />
                <FormControl fullWidth required>
                  <InputLabel id="state-label">State</InputLabel>
                  <Select
                    labelId="state-label"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    label="State"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "4px",
                      },
                      "& .MuiOutlinedInput-input": {
                        padding: "12px 16px",
                        fontSize: "1rem",
                      },
                    }}
                  >
                    {[
                      "Andhra Pradesh",
                      "Arunachal Pradesh",
                      "Assam",
                      "Bihar",
                      "Chhattisgarh",
                      "Goa",
                      "Gujarat",
                      "Haryana",
                      "Himachal Pradesh",
                      "Jharkhand",
                      "Karnataka",
                      "Kerala",
                      "Madhya Pradesh",
                      "Maharashtra",
                      "Manipur",
                      "Meghalaya",
                      "Mizoram",
                      "Nagaland",
                      "Odisha",
                      "Punjab",
                      "Rajasthan",
                      "Sikkim",
                      "Tamil Nadu",
                      "Telangana",
                      "Tripura",
                      "Uttar Pradesh",
                      "Uttarakhand",
                      "West Bengal",
                      "Andaman and Nicobar Islands",
                      "Chandigarh",
                      "Dadra and Nagar Haveli and Daman and Diu",
                      "Delhi",
                      "Jammu and Kashmir",
                      "Ladakh",
                      "Lakshadweep",
                      "Puducherry",
                    ].map((state) => (
                      <MenuItem key={state} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div className="flex flex-col md:flex-row gap-3 mb-3">
                <TextField
                  name="landmark"
                  label="Landmark (Optional)"
                  variant="outlined"
                  fullWidth
                  value={form.landmark}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "4px",
                    },
                    "& .MuiOutlinedInput-input": {
                      padding: "12px 16px",
                      fontSize: "1rem",
                    },
                  }}
                />
                <TextField
                  name="alternatePhone"
                  label="Alternate Phone (Optional)"
                  variant="outlined"
                  fullWidth
                  inputProps={{
                    maxLength: 10,
                    pattern: "\\d*",
                  }}
                  value={form.alternatePhone}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "4px",
                    },
                    "& .MuiOutlinedInput-input": {
                      padding: "12px 16px",
                      fontSize: "1rem",
                    },
                  }}
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center my-4">
                <span className="font-medium">Address Type</span>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="type"
                      value="Home"
                      checked={form.type === "Home"}
                      onChange={handleChange}
                    />
                    Home
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="type"
                      value="Work"
                      checked={form.type === "Work"}
                      onChange={handleChange}
                    />
                    Work
                  </label>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded bg-gray-100 text-gray-800 border order-2 md:order-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-[#22B6FC] text-white font-semibold order-1 md:order-2"
              >
                {isEdit ? "Save" : "Add"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SavedAddress;
