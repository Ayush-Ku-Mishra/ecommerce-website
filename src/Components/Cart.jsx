import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoBagCheckOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../redux/cartSlice"; // Adjust path accordingly
import ContactUsPart from "./ContactUsPart";

const Cart = () => {
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  // Pagination state: show initial 10 items, load more on demand
  const [visibleCount, setVisibleCount] = useState(10);
  const visibleItems = cart.slice(0, visibleCount);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  // Calculate subtotal price (sum of original prices * quantity)
  const subtotal = cart.reduce(
    (sum, item) => sum + (item.originalPrice || 0) * (item.quantity || 1),
    0
  );

  // Calculate total discount amount across all cart items
  const totalDiscount = cart.reduce((discountSum, item) => {
    const original = item.originalPrice || 0;
    const current = item.price || 0;
    const qty = item.quantity || 1;
    // ensure originalPrice is greater than price to avoid negative or zero discount
    const discountPerItem = original > current ? original - current : 0;
    return discountSum + discountPerItem * qty;
  }, 0);

  // Shipping cost (hardcoded free)
  const shippingCost = 0;

  // Total after discount and shipping
  // total = subtotal - totalDiscount + shippingCost (shippingCost=0)
  const total = subtotal - totalDiscount;

  return (
    <div>
      <div className="flex gap-6 ml-16 mt-4 max-w-[1230px] mx-auto mb-8">
      <div className="flex flex-col md:flex-row gap-8 w-full">
        {/* Left: Cart items or empty state */}
        <div
          className={`bg-white rounded-sm shadow-md p-8 flex flex-col justify-between mb-4 md:mb-0 border-2 ${
            cart.length === 0 ? "w-full mr-10" : "md:w-2/3"
          }`}
        >
          <h1 className="text-2xl font-semibold mb-2">My Cart</h1>
          <p className="text-gray-700 mb-6 text-base">
            There are{" "}
            <span className="text-red-500 font-semibold">{cart.length}</span>{" "}
            products in your cart
          </p>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 rounded-xl flex-1 border-2 border-dashed border-gray-300 bg-gray-50">
              <img
                src="https://ecommerce-frontend-view.netlify.app/empty-cart.png"
                alt="Empty Cart"
                className="w-32 h-32 mb-6"
              />
              <p className="text-base font-medium text-gray-600 mb-5">
                Your cart is currently empty!
              </p>
              <Link
                to="/"
                className="bg-red-500 text-white px-8 py-3 rounded-md font-semibold shadow hover:bg-red-600 transition"
                title="Continue Shopping"
              >
                CONTINUE SHOPPING
              </Link>
            </div>
          ) : (
            <>
              {/* Cart items list */}
              <ul className="divide-y border rounded-xl overflow-hidden">
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
                        className="w-24 h-28 rounded overflow-hidden block flex-shrink-0"
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
                        <Link
                          to={`/product/${product.id}`}
                          className="block text-[14px] leading-[22px] font-[500] text-[rgba(0,0,0,0.9)] hover:text-blue-500 truncate whitespace-nowrap overflow-hidden"
                        >
                          {product.title}
                        </Link>

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

              {/* Load More button */}
              {visibleCount < cart.length && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={loadMore}
                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right: Cart Totals Card */}
        {cart.length > 0 && (
          <div className="max-w-[350px] h-[390px] sticky top-32 self-start bg-white rounded-lg shadow-md p-6 border border-gray-200 md:w-1/4">
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
              <span className="text-black text-[16px] font-bold">
                Total Amount
              </span>
              <span className="text-red-500 text-[16px] font-bold">
                ₹
                {total.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <Link
              to="/checkout"
              className="w-full bg-[#fa5652] hover:bg-[#e94843] text-white text-[17px] font-semibold rounded-lg py-2 mt-4 flex items-center justify-center gap-1 shadow transition"
              style={{ letterSpacing: 1 }}
              title="Place Order"
            >
              <IoBagCheckOutline size={22} className="mr-2" />
              PLACE ORDER
            </Link>
          </div>
        )}
      </div>
    </div>
    <ContactUsPart/>
    </div>
  );
};

export default Cart;
