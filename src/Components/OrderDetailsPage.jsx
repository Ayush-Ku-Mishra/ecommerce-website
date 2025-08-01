import React from "react";
import OrderStatusTracker from "./OrderStatusTracker";
import ContactUsPart from "./ContactUsPart";

const OrderDetailsPage = () => {
  // Static demo values for illustration
  const img =
    "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/2/z/g/m-oversizetsrt-114-kajaru-original-imah82szb2j8fxg3.jpeg?q=70";
  const title = "Men Striped Round Neck Polycotton Brown T-Shirt";
  const size = "M";
  const qty = 1;
  const price = 304.0;
  const exchangeUrl = "#";
  const returnUrl = "#";
  const returnDate = "17 Aug, 2025";
  const orderId = "6887b583228db479bba3d66a";
  const date = "16 Jul, 2025";

  // Placeholders for cart summary, replace with your data
  const cart = [{}]; // example 3 items; replace with your cart array
  const subtotal = 1234.56; // example subtotal
  const totalDiscount = 123.45; // example discount
  const total = 304.00; // example total after discount

  return (
    <div>
        <div className="flex mt-4 gap-5 mb-20">
      <div className="w-[55%] ml-32">
        <div className="bg-gray-200 flex items-center justify-between p-4">
          <p className="text-[#282d3f] text-[14px] font-bold ">
            Order ID:{" "}
            <span className="text-gray-500 text-[13px]">{orderId}</span>
          </p>
          <p className="text-[#282d3f] text-[14px] font-bold ">
            Date: <span className="text-gray-500 text-[13px]">{date}</span>
          </p>
        </div>
        <div>
          <section className="flex gap-4 bg-white border border-gray-300 p-4 items-center">
            {/* Product Image */}
            <div className="w-24 h-28 rounded-lg bg-[#0e1d2d] flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={title}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Details */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-[400] text-gray-900">{title}</h2>
                  <div className="mt-1 text-gray-600 text-sm flex flex-wrap gap-4">
                    <span>
                      Size:{" "}
                      <b className="font-semibold text-gray-700">{size}</b>
                    </span>
                    <span>
                      Qty: <b className="font-semibold text-gray-700">{qty}</b>
                    </span>
                  </div>
                </div>
                <div className="mt-3 md:mt-0 flex-shrink-0 ml-0 md:ml-8 text-right">
                  <p className="text-lg font-bold text-gray-900">
                    ₹ {price}.00
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-3">
                <a
                  href={exchangeUrl}
                  className="border border-teal-800 px-4 py-[6px] rounded-md text-teal-800 hover:bg-teal-600 hover:text-white font-medium transition"
                >
                  Exchange
                </a>
                <a
                  href={returnUrl}
                  className="border border-teal-800 px-4 py-[6px] rounded-md text-teal-800 hover:bg-teal-600 hover:text-white font-medium transition"
                >
                  Return
                </a>
              </div>
              {returnDate && (
                <div className="text-xs text-gray-500 mt-2">
                  Exchange / Return valid till <b>{returnDate}</b>
                </div>
              )}
            </div>
          </section>

          <div>
            {/* Order Status Tracker */}
            <OrderStatusTracker
              currentStatus="in_transit"
              statusDates={{
                placed: "2024-07-01",
                shipped: "2024-07-02",
                in_transit: "2024-07-04",
                out_for_delivery: null,
                delivered: null,
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="w-[25%] bg-white rounded-lg shadow-md p-6 border border-gray-200 max-h-[330px]"
        style={{
          maxWidth: 350,
          /* Dynamically compute left to avoid overlap */
          left: "calc((100vw - 1150px)/2 + 767px + 0px)",
          zIndex: 10, // To ensure it overlaps content if needed
        }}
      >
        <h2 className="text-lg font-semibold mb-4">Price Details</h2>
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
    <ContactUsPart/>
    </div>
  );
};

export default OrderDetailsPage;
