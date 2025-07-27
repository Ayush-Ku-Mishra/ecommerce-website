import React from "react";
import AccountDetailsSection from "./AccountDetailsSection";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "../redux/wishlistSlice"; // path as per your structure
import { MdDeleteOutline } from "react-icons/md"; // for trash icon
import ContactUsPart from "./ContactUsPart";

const Wishlist = () => {
  const wishlist = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();

  return (
    <div>
      <div className="flex gap-6 ml-10 mt-2 max-w-[1190px] mx-auto mb-8">
      {/* Sidebar with Account Details */}
      <div className="w-[300px]">
        <AccountDetailsSection />
      </div>

      {/* Main Content (Right) */}
      <div className="flex-1 flex flex-col border-2 shadow mt-5 rounded-xl bg-white p-8">
        <div className="mb-6">
          <p className="text-2xl font-semibold mb-1">My Wishlist</p>
          <p className="text-gray-700">
            There are{" "}
            <span className="text-red-500 font-semibold">{wishlist.length}</span>{" "}
            products in My List
          </p>
        </div>

        {wishlist.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center flex-grow border-2 border-dashed border-gray-300 rounded-xl p-10 bg-gray-50">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
              alt="Empty List"
              className="w-32 h-32 mb-6"
            />
            <p className="text-gray-600 text-center mb-4 text-lg">
              My List is currently empty
            </p>
            <Link
              to="/"
              className="mt-2 bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors duration-300 font-semibold shadow-md"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        ) : (
          // Wishlist Items Grid
          <div>
            <ul className="divide-y border rounded-xl overflow-hidden">
              {wishlist.map((product) => (
                <li
                  key={product.id}
                  className="flex px-6 py-6 items-center gap-5 bg-white"
                >
                  {/* Wrap image and product info inside Link */}
                  <Link
                    to={`/product/${product.id}`}
                    className="flex flex-1 items-center gap-5 no-underline group"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1 px-2">
                      <h3 className="text-[14px] leading-[20px] mt-1 font-[500] mb-1 text-[rgba(0,0,0,0.9)] min-h-[40px] line-clamp-2 group-hover:text-blue-500">
                        {product.title}
                      </h3>
                      <div className="flex gap-2 items-center text-gray-600 mt-1">
                        {product.description && (
                          <span className="text-xs text-gray-500">
                            {product.description}
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="text-red-500 font-[600] text-xl mt-1">
                          ₹{product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="line-through text-gray-500 font-[16px] ml-2">
                            ₹{product.originalPrice}
                          </span>
                        )}
                        {product.discount && (
                          <span className="ml-2 text-green-500 text-sm font-semibold">
                            {product.discount} off
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/* Remove button outside of Link */}
                  <button
                    title="Remove"
                    onClick={() => dispatch(removeFromWishlist(product.id))}
                    className="p-2 text-xl text-gray-400 hover:text-red-500 transition"
                  >
                    <MdDeleteOutline />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
    <ContactUsPart/>
    </div>
  );
};

export default Wishlist;
