import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { IoBagCheckOutline } from "react-icons/io5";
import { BiCurrentLocation } from "react-icons/bi";
import TextField from "@mui/material/TextField";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { addAddress, editAddress } from "../redux/addressSlice";
import { toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";
import { AiOutlineCheck } from "react-icons/ai";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../redux/cartSlice";
import HorizontalLinearAlternativeLabelStepper from "./HorizontalLinearAlternativeLabelStepper";

const emptyAddress = {
  name: "",
  phone: "",
  address: "",
  pincode: "",
  locality: "",
  city: "",
  state: "",
  landmark: "",
  alternatePhone: "",
  tag: "Home",
  type: "Home",
  isDefault: false,
};

const CheckoutPage = () => {
  const cart = useSelector((state) => state.cart.items || []);
  const addresses = useSelector((state) => state.addresses.addresses);
  const dispatch = useDispatch();
  const [step, setStep] = useState("address"); // default to "address" step showing
  const [selectedAddressId, setSelectedAddressId] = useState(() =>
    addresses.length > 0 ? addresses[0].id : null
  );

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0].id);
    }
  }, [addresses]);

  // Modal state for add/edit
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState(emptyAddress);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const [visibleCount, setVisibleCount] = useState(10);
  const visibleItems = cart.slice(0, visibleCount);

  const handleOpenAdd = () => {
    setIsEdit(false);
    setForm({
      ...emptyAddress,
      isDefault: addresses.length === 0,
    });
    setOpen(true);
  };

  React.useEffect(() => {
    const stepToIndex = {
      address: 0,
      summary: 1,
      payment: 2,
    };
    setActiveStepIndex(stepToIndex[step] ?? 0);
  }, [step]);

  const handleOpenEdit = (addr) => {
    setIsEdit(true);
    setForm(addr);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

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
            locality: address.suburb || address.neighbourhood || "",
            address: `${
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.pincode) return;

    const updatedForm = {
      ...form,
      tag: form.type,
      isDefault: isEdit ? form.isDefault : addresses.length === 0,
    };

    if (isEdit) {
      dispatch(editAddress(updatedForm));
      toast.success("Address updated");
    } else {
      dispatch(addAddress(updatedForm));
      toast.success("Address added");
    }

    setOpen(false);
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.originalPrice || 0) * (item.quantity || 1),
    0
  );

  const totalDiscount = cart.reduce((discountSum, item) => {
    const original = item.originalPrice || 0;
    const current = item.price || 0;
    const qty = item.quantity || 1;
    const discountPerItem = original > current ? original - current : 0;
    return discountSum + discountPerItem * qty;
  }, 0);

  const total = subtotal - totalDiscount;

  return (
    <div className="flex flex-col items-start justify-between max-w-[1200px] mx-auto mt-10 mb-10 px-4">
      <HorizontalLinearAlternativeLabelStepper activeStep={activeStepIndex}  />

      {/* Delivery Address Section */}
      <div className="border-2 border-gray-200 shadow rounded-xl ml-10 w-[60%] p-6 bg-white">
        <div className="flex justify-between items-center border-t-2 border-l-2 border-r-2 p-4 ">
          <h2 className="text-xl font-semibold text-gray-800">
            <span className="inline-flex items-center gap-2 text-gray-800 font-semibold">
              <span className="text-white bg-[#2874f0] flex items-center justify-center w-6 h-6 rounded">
                {step !== "address" ? <AiOutlineCheck size={20} /> : "1"}
              </span>
              Select Delivery Address
            </span>
          </h2>

          {step === "address" && addresses.length > 0 && (
            <div
              onClick={handleOpenAdd}
              className="p-2 cursor-pointer border-2 border-[#22B6FC] border-dashed bg-[#f1faff] hover:bg-[#e5f5fb] rounded-md font-semibold transition ml-4"
            >
              <button className="text-[#22B6FC] text-sm px-3 py-1">
                <span className="text-[18px] font-bold mr-1">+</span> ADD NEW
                ADDRESS
              </button>
            </div>
          )}
        </div>
        {/* Address Content: show only on step 'address' */}
        {step === "address" && (
          <>
            {addresses.length === 0 ? (
              /* No addresses - Empty State */
              <div className="flex flex-col items-center justify-center flex-grow border-2 border-dashed border-gray-300 rounded-xl p-10 bg-gray-50">
                <img
                  src="https://ecommerce-frontend-view.netlify.app/map.png"
                  alt="No Address"
                  className="w-28 h-28 mb-2 opacity-80"
                />
                <p className="text-gray-600 text-center mb-4 text-lg">
                  No addresses found in your account!
                </p>
                <button
                  onClick={handleOpenAdd}
                  className="mt-2 bg-red-500 text-white px-7 py-2.5 text-[15px] rounded-lg hover:bg-red-600 transition-colors duration-300 font-semibold tracking-wide"
                >
                  ADD ADDRESS
                </button>
              </div>
            ) : (
              /* Render saved addresses */
              <div className="border-l-2 border-r-2 p-4 border-b-2 mb-4 shadow-sm">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`bg-white border ${
                      selectedAddressId === addr.id
                        ? "border-[#22B6FC] bg-red-50 shadow-lg"
                        : "border-[#e5e7eb] shadow-md"
                    } rounded-lg px-5 py-4 mb-4 flex items-start gap-4 cursor-pointer transition`}
                    style={{ boxShadow: "0 2px 12px 0 #eef6fa" }}
                    onClick={() => setSelectedAddressId(addr.id)}
                  >
                    <input
                      type="radio"
                      name="selectedAddress"
                      value={addr.id}
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="accent-red-500 mt-[6px] shrink-0"
                      style={{ width: 18, height: 18 }}
                    />

                    <div className="flex flex-col flex-grow">
                      {/* Address Tag & Edit */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold bg-[#e5f5fb] px-3 py-[3px] rounded-full text-[#22B6FC] uppercase">
                          {addr.tag}
                        </span>

                        <button
                          className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded hover:border-blue-400 text-blue-500 text-sm font-semibold transition"
                          title="Edit Address Tag"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEdit(addr);
                          }}
                        >
                          Edit
                        </button>
                      </div>

                      {/* Name and Phone */}
                      <div className="flex flex-wrap gap-4 items-center mb-1">
                        <span className="font-bold text-gray-900 text-[16px]">
                          {addr.name}
                        </span>
                        <span className="text-gray-700 font-semibold text-[15px]">
                          {addr.phone}
                        </span>
                      </div>

                      {/* Full Address */}
                      <div className="text-gray-700 text-[15px] leading-relaxed break-words mb-1">
                        {addr.address}, {addr.locality}, {addr.city},{" "}
                        {addr.state}
                      </div>

                      {/* Pincode */}
                      <div className="text-gray-500 text-[15px]">
                        Pincode: {addr.pincode}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* Continue button to go to summary step */}
            {addresses.length > 0 && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    if (!selectedAddressId) {
                      toast.error("Please select an address to proceed");
                      return;
                    }
                    setStep("summary");
                  }}
                  className="px-4 py-2 bg-[#22B6FC] text-white rounded hover:bg-blue-700 transition"
                >
                  Continue to Order Summary
                </button>
              </div>
            )}
          </>
        )}

        {/* If step is 'summary', hide the address list (or show only heading + 'add new' button) */}
        {step === "summary" && (
          <div className="p-4">
            <p className="text-gray-500 italic">
              Delivery address selected.{" "}
              <button
                onClick={() => setStep("address")}
                className="text-blue-600 underline ml-2"
              >
                Change address
              </button>
            </p>
          </div>
        )}

        {/* Modal */}
        {open && (
          <div
            className="fixed mt-32 inset-0 bg-black bg-opacity-20 flex items-center justify-center"
            style={{ zIndex: 9999, top: 0, left: 0, right: 0, bottom: 0 }}
          >
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
              {/* ...rest of your inputs here unchanged... */}
              <div className="mb-3">
                {/* Your existing form inputs exactly as before */}
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
                      pattern: "\\d*",
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
                  name="address"
                  label="Address (Area and Street)"
                  variant="outlined"
                  required
                  fullWidth
                  multiline
                  rows={2}
                  value={form.address}
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
                      {/* Your states list here unchanged */}
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

        <div className="border-2 p-4 shadow-sm shadow-blue-400">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            <span className="inline-flex items-center gap-2 text-gray-800 font-semibold">
              <span className="text-white bg-[#2874f0] flex items-center justify-center w-6 h-6 rounded">
                {step !== "summary" ? "2" : <AiOutlineCheck size={20} />}
              </span>
              Order Summary
            </span>
          </h2>
          {step === "summary" ? (
            cart.length === 0 ? (
              <p className="text-gray-600">No products selected.</p>
            ) : (
              <ul className="divide-y border rounded-xl overflow-hidden max-h-[600px] overflow-y-auto">
                {visibleItems.map((product) => (
                  <li
                    key={product.id}
                    className="flex flex-col px-6 py-6 bg-white relative"
                  >
                    {/* Top Row: Image, Details, Delete icon */}
                    <div className="flex items-center gap-5 w-full">
                      {/* Image */}
                      <Link
                        to={`/product/${product.id}`}
                        className="w-20 h-24 rounded overflow-hidden block flex-shrink-0"
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover object-top"
                          loading="lazy"
                        />
                      </Link>

                      {/* Product details */}
                      <div className="flex-1 px-2 min-w-0">
                        <div className="block text-[14px] leading-[22px] font-[500] text-[rgba(0,0,0,0.9)] hover:text-blue-500 truncate whitespace-nowrap overflow-hidden">
                          {product.title}
                        </div>

                        <p className="text-[14px] text-[#878787]">
                          Size: {product.selectedSize || "N/A"}
                        </p>
                        <p className="text-[14px] text-[#878787] mt-1">
                          Brand: {product.brand}
                        </p>

                        <div className="flex gap-2 items-center text-gray-600 mt-1">
                          {product.description && (
                            <span className="text-xs text-gray-500">
                              {product.description}
                            </span>
                          )}
                        </div>

                        <div>
                          <span className="text-red-500 font-[600] text-xl mt-1">
                            ₹{(product.price || 0).toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="line-through text-gray-500 font-[16px] ml-2">
                              ₹{(product.originalPrice || 0).toLocaleString()}
                            </span>
                          )}
                          {product.discount && (
                            <span className="ml-2 text-green-500 text-sm font-semibold">
                              {product.discount} off
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Delete icon */}
                      <button
                        title="Remove"
                        onClick={() => {
                          dispatch(removeFromCart(product.id));
                          toast.info("Removed from cart");
                        }}
                        className="p-2 text-xl text-gray-400 hover:text-red-500 transition flex-shrink-0"
                      >
                        <MdDeleteOutline />
                      </button>
                    </div>

                    {/* Quantity selector below */}
                    {product.quantity !== undefined && (
                      <div className="mt-4 flex items-center gap-2 w-max select-none ml-28">
                        {/* Minus button */}
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(decreaseQuantity({ id: product.id }))
                          }
                          className="w-7 h-7 rounded-full bg-gray-100 text-black flex items-center justify-center hover:bg-gray-300 transition"
                          aria-label="Decrease quantity"
                        >
                          &minus;
                        </button>

                        {/* Quantity display */}
                        <span className="min-w-[50px] text-center bg-white px-2 py-1 rounded border border-gray-300 font-semibold text-sm text-black">
                          {product.quantity}
                        </span>

                        {/* Plus button */}
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(increaseQuantity({ id: product.id }))
                          }
                          className="w-7 h-7 rounded-full bg-gray-100 text-black flex items-center justify-center hover:bg-gray-300 transition"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )
          ) : (
            <p className="text-gray-500 italic">
              Complete address selection to view order summary
            </p>
          )}
        </div>

        {step === "summary" && (
          <>
            {/* Your existing order summary UI rendering */}

            {/* Show Proceed to Payment button only if address selected and cart not empty */}
            {selectedAddressId && cart.length > 0 && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setStep("payment")}
                  className="px-6 py-3 bg-[#fa5652] hover:bg-[#e94843] text-white rounded-md transition text-lg"
                >
                  Proceed to Payment
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div
        className="max-w-[260px] mt-16 w-[35%] fixed bg-white rounded-lg shadow-md p-6 border border-gray-200 md:w-1/3"
        style={{
          maxWidth: 320,
          left: "calc((100vw - 1150px)/2 + 780px)",
          zIndex: 10,
        }}
      >
        <h2 className="text-lg font-semibold mb-4">Cart Totals</h2>
        <hr className="mb-4" />
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-700 text-[16px]">
            Price ({cart.length} item{cart.length !== 1 ? "s" : ""})
          </span>
          <span className="text-red-500 text-[16px] font-semibold">
            ₹
            {subtotal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-700 text-[16px]">Discount</span>
          <span className="text-[#388e3c] text-[16px] font-semibold">
            - ₹
            {totalDiscount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700 text-[16px]">Shipping</span>
          <span className="font-bold text-gray-700 text-[16px]">Free</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700 text-[16px]">Estimate for</span>
          <span className="text-gray-700"></span>
        </div>
        <div className="flex justify-between items-center mt-6 mb-8 border-t-2 border-b-2 border-dashed p-2">
          <span className="text-black text-[16px] font-bold">Total Amount</span>
          <span className="text-red-500 text-[16px] font-bold">
            ₹
            {total.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
