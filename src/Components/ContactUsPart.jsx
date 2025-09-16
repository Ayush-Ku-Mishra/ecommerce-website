import React from "react";
import { LiaShippingFastSolid } from "react-icons/lia";
import { PiKeyReturnLight } from "react-icons/pi";
import { MdOutlinePayment } from "react-icons/md";
import { GoGift } from "react-icons/go";
import { BiSupport } from "react-icons/bi";
import { Link } from "react-router-dom";
import { FaRegMessage } from "react-icons/fa6";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const ContactUsPart = () => {
  return (
    <>
      {/* Section 1: Features and Contact */}
      <section className="bg-[#f9f9f9] w-full py-10 border-t-2" id="contactus">
        {/* Top Features Row */}
        <div className="w-full flex justify-center px-4">
          <div className="flex items-start justify-center gap-6 sm:gap-8 md:gap-10 flex-wrap max-w-6xl">
            {[
              {
                icon: <LiaShippingFastSolid />,
                title: "Free Shipping",
                text: "For all Orders Over $100",
              },
              {
                icon: <PiKeyReturnLight />,
                title: "7 Days Returns",
                text: "For an Exchange Product",
              },
              {
                icon: <MdOutlinePayment />,
                title: "Secured Payment",
                text: "Payment Cards Accepted",
              },
              {
                icon: <GoGift />,
                title: "Special Gifts",
                text: "Our First Product Order",
              },
              {
                icon: <BiSupport />,
                title: "Support 24/7",
                text: "Contact us Anytime",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 group w-[140px] sm:w-[160px] md:w-auto"
              >
                <div className="text-[36px] sm:text-[40px] transition-all duration-300 group-hover:text-red-400 group-hover:-translate-y-1">
                  {f.icon}
                </div>
                <h3 className="text-[15px] sm:text-[16px] font-[600] mt-2">
                  {f.title}
                </h3>
                <p className="text-[12px] sm:text-[13px] font-[500] text-center">
                  {f.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Section */}
        <div className="lg:mt-16 mt-10 border-t pt-10 max-w-6xl mx-auto px-4 flex flex-wrap justify-between gap-10">
          {/* Contact */}
          <div className="flex flex-col max-w-sm">
            <h3 className="text-[18px] font-[600] mb-4">Contact us</h3>
            <p className="text-[13px] font-[400] mb-1">
              Pickora - Mega Super Store
            </p>
            <p className="text-[13px] font-[400]">
              507-Union Trade Centre France
            </p>
            <a
              className="text-[13px] mt-6 hover:text-red-400 hover:underline"
              href="#"
            >
              contactus@pickora.com
            </a>
            <p className="mt-3 text-[22px] font-[600] text-red-500">
              (+91) 9876-543-210
            </p>
            <div className="flex items-center gap-2 mt-5">
              <FaRegMessage className="text-red-500 text-[40px]" />
              <h3 className="text-[16px] font-[600]">
                Online Chat <br />
                Get Expert Help
              </h3>
            </div>
          </div>

          {/* Products */}
          <div className="flex flex-col">
            <h3 className="text-[18px] font-[600] mb-4">Products</h3>
            <Link
              to="/"
              className="mb-2 hover:text-red-400 hover:underline text-[14px]"
            >
              Prices drop
            </Link>
            <Link
              to="/"
              className="mb-2 hover:text-red-400 hover:underline text-[14px]"
            >
              New products
            </Link>
            <Link
              to="/"
              className="mb-2 hover:text-red-400 hover:underline text-[14px]"
            >
              Best sales
            </Link>
            <Link
              to="/"
              className="mb-2 hover:text-red-400 hover:underline text-[14px]"
            >
              Contact us
            </Link>
            <Link
              to="/"
              className="mb-2 hover:text-red-400 hover:underline text-[14px]"
            >
              Sitemap
            </Link>
            <Link
              to="/"
              className="mb-2 hover:text-red-400 hover:underline text-[14px]"
            >
              Stores
            </Link>
          </div>

          {/* Company */}
          <div className="flex flex-col">
            <h3 className="text-[18px] font-[600] mb-4">Our company</h3>
            <Link
              to="/"
              className="mb-2 hover:text-red-400 hover:underline text-[14px]"
            >
              About Pickora
            </Link>
            <Link
              to="/"
              className="mb-2 hover:text-red-400 hover:underline text-[14px]"
            >
              Vision
            </Link>
            <Link
              to="/"
              className="mb-2 hover:text-red-400 hover:underline text-[14px]"
            >
              Terms and conditions of use
            </Link>
            <Link
              to="/"
              className="mb-2 hover:text-red-400 hover:underline text-[14px]"
            >
              We Respect Your Privacy
            </Link>
            <Link
              to="/"
              className="mb-2 hover:text-red-400 hover:underline text-[14px]"
            >
              Secure payment
            </Link>
            <Link
              to="/"
              className="mb-2 hover:text-red-400 hover:underline text-[14px]"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: Bottom Footer */}
      <section className="border-t bg-gray-100 w-full py-3">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Social Icons */}
          <div className="flex items-center gap-4 text-[18px] text-gray-600">
            <a href="#" className="hover:text-red-500 transition">
              <FaFacebook />
            </a>
            <a href="#" className="hover:text-red-500 transition">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-red-500 transition">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-red-500 transition">
              <FaLinkedin />
            </a>
          </div>

          {/* Center Text */}
          <div className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} <strong>Pickora</strong>. All rights
            reserved. |
            <a href="#" className="ml-1 underline hover:text-red-500">
              Privacy Policy
            </a>
          </div>

          {/* Payment Icons */}
          <div className="flex items-center gap-3">
            <img
              src="https://ecommerce-frontend-view.netlify.app/carte_bleue.png"
              alt="Carte"
              className="w-10 h-6 object-contain"
            />
            <img
              src="https://ecommerce-frontend-view.netlify.app/visa.png"
              alt="Visa"
              className="w-10 h-6 object-contain"
            />
            <img
              src="https://ecommerce-frontend-view.netlify.app/master_card.png"
              alt="MasterCard"
              className="w-10 h-6 object-contain"
            />
            <img
              src="https://ecommerce-frontend-view.netlify.app/paypal.png"
              alt="PayPal"
              className="w-10 h-6 object-contain"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUsPart;
