import React, { useState, useEffect } from "react";
import AccountDetailsSection from "./AccountDetailsSection";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import TextField from "@mui/material/TextField";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { BiCurrentLocation } from "react-icons/bi";
import { toast } from "react-toastify";
import {
  addAddress,
  editAddress,
  deleteAddress,
  setDefaultAddress,
  setAddresses,
} from "../redux/addressSlice";
import axios from "axios";
import ContactUsPart from "./ContactUsPart";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { AddressCardSkeleton } from "../Skeletons/AddressCardSkeleton";
import { SidebarSkeleton } from "../Skeletons/SidebarSkeleton";

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
  const addresses = useSelector((state) => state.addresses.addresses);
  const dispatch = useDispatch();

  // Modal state for add/edit
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState(emptyAddress);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load addresses from backend on mount
  useEffect(() => {
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
          dispatch(setAddresses(data.addresses));
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

    fetchAddresses();
  }, [dispatch]);

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
      isDefault: addr.isDefault || addr.default || false, // ✅ Handle both field names
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
          }`, // ✅ Fixed: use correct route
          formData, // ✅ Send formData with both field names
          { withCredentials: true }
        );
        if (data.success) {
          dispatch(editAddress(data.address));
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
          dispatch(addAddress(data.address));
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
      setSaving(false); // Hide backdrop spinner
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/address/delete/${id}`,
        { withCredentials: true }
      );
      if (data.success) {
        dispatch(deleteAddress(id));
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
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/address/${id}/default`, // ✅ Fixed: use id parameter
        {},
        { withCredentials: true }
      );

      if (data.success) {
        dispatch(setDefaultAddress(id));
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
      <div className="flex gap-10 ml-10 mt-2 mb-8 max-w-[1190px]">
        <div className="flex-shrink-0 min-w-[20%] w-auto sticky top-28 self-start">
          <SidebarSkeleton />
        </div>
        <div className="w-[80%]">
          {[...Array(2)].map((_, i) => (
            <AddressCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
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
                    {addr.isDefault && (
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
                    {!addr.isDefault && (
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

          {/* Modal (very simple, for brevity) */}
          {open && (
            <div className="fixed mt-32 inset-0 bg-black bg-opacity-20 flex items-center justify-center z-40">
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
                className="bg-white rounded-xl p-8 shadow-xl w-full max-w-3xl"
                onSubmit={handleSubmit}
              >
                <h2 className="text-lg font-bold mb-4">
                  {isEdit ? "Edit Address" : "Add Address"}
                </h2>

                <button
                  type="button"
                  onClick={useMyLocation}
                  disabled={loadingLocation}
                  className="mb-3 px-3 py-2 bg-blue-600 text-white text-[14px] rounded hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <BiCurrentLocation className="text-lg" />
                  {loadingLocation
                    ? "Detecting Location..."
                    : "Use My Current Location"}
                </button>
                <div className="mb-3">
                  <div className="flex gap-3 mb-3">
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
                          padding: "12px 16px", // Slightly larger than py-2 px-3
                          fontSize: "1rem", // Slightly larger text
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
                        pattern: "[6-9][0-9]{9}", // Phone must start with 6-9 followed by 9 digits
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
                  <div className="flex gap-3 mb-3">
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
                          padding: "12px 16px", // Similar to py-3 px-4
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
                          padding: "12px 16px", // Similar to py-3 px-4
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

                  <div className="flex gap-3 mb-3">
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

                  <div className="flex gap-3 mb-3">
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

                  <div className="flex gap-4 items-center my-2">
                    <span className="font-medium">Address Type</span>
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
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-3 py-1 rounded bg-gray-100 text-gray-800 border"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 rounded bg-[#22B6FC] text-white font-semibold"
                  >
                    {isEdit ? "Save" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      <ContactUsPart />
    </div>
  );
};

export default SavedAddress;
