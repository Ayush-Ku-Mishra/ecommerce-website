import React, { useState, useContext, useEffect } from "react";
import { Context } from "../main"; // Adjust path
import AccountDetailsSection from "./AccountDetailsSection";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "../redux/wishlistSlice";
import { MdDeleteOutline } from "react-icons/md";
import ContactUsPart from "./ContactUsPart";
import { toast } from "react-toastify";

const Wishlist = () => {
  const { isAuthenticated } = useContext(Context);
  const wishlist = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();
  const [visibleCount, setVisibleCount] = useState(10);
  const loadMore = () => setVisibleCount((prev) => prev + 10);
  const visibleItems = wishlist.slice(0, visibleCount);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      // Replace Wishlist with login in history stack for correct back behavior
      navigate("/login", { state: { from: location }, replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  if (!isAuthenticated) return null;

  return (
    <div>
      <div className="flex gap-10 ml-10 mt-2 max-w-[1190px] mx-auto mb-8">
        <div className="min-w-[20%] w-auto sticky top-28 self-start">
          <AccountDetailsSection />
        </div>
        <div className="flex-1 flex w-[80%] flex-col border-2 shadow mt-5 rounded-xl bg-white p-6">
          <div className="mb-6">
            <p className="text-2xl font-semibold mb-1">My Wishlist</p>
            <p className="text-gray-700">
              There are{" "}
              <span className="text-red-500 font-semibold">{wishlist.length}</span>{" "}
              products in your list
            </p>
          </div>
          {wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-grow border-2 border-dashed border-gray-300 rounded-xl p-10 bg-gray-50">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                alt="Empty"
                className="w-32 h-32 mb-6"
              />
              <p className="text-gray-600 text-center mb-4 text-lg">
                Your list is currently empty!
              </p>
              <Link
                to="/"
                className="mt-2 bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors duration-300 font-semibold"
              >
                CONTINUE SHOPPING
              </Link>
            </div>
          ) : (
            <>
              <ul className="divide-y border rounded-xl overflow-hidden">
                {visibleItems.map((product) => (
                  <li
                    key={product.id}
                    className="flex px-6 py-6 items-center gap-5 bg-white"
                  >
                    <Link
                      to={`/product/${product.id}`}
                      className="flex flex-1 min-w-0 items-center gap-5 no-underline group"
                    >
                      <div className="w-24 h-24 overflow-hidden rounded flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover object-top"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 px-2 min-w-0">
                        <h3 className="text-[14px] leading-[22px] mt-1 font-[500] mb-1 text-[rgba(0,0,0,0.9)] group-hover:text-blue-500 truncate whitespace-nowrap overflow-hidden w-[550px] min-h-[40px]">
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
                          <span className="text-red-500 font-semibold text-xl">
                            ₹{(product.price || 0).toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="line-through text-gray-500 ml-2 text-lg">
                              ₹{(product.originalPrice || 0).toLocaleString()}
                            </span>
                          )}
                          {product.discount && (
                            <span className="ml-2 text-green-500 font-semibold text-sm">
                              {product.discount} off
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                    <button
                      title="Remove"
                      onClick={() => {
                        dispatch(removeFromWishlist(product.id));
                        toast.info("Removed from wishlist");
                      }}
                      className="p-2 text-xl text-gray-400 hover:text-red-500 flex-shrink-0"
                    >
                      <MdDeleteOutline />
                    </button>
                  </li>
                ))}
              </ul>
              {visibleCount < wishlist.length && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={loadMore}
                    className=" text-[#2874f0] rounded-lg"
                  >
                    Load more items
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <ContactUsPart />
    </div>
  );
};

export default Wishlist;
