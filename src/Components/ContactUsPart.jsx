import React, { useState } from "react";
import { LiaShippingFastSolid } from "react-icons/lia";
import { PiKeyReturnLight } from "react-icons/pi";
import { MdOutlinePayment } from "react-icons/md";
import { GoGift } from "react-icons/go";
import { BiSupport } from "react-icons/bi";
import { Link } from "react-router-dom";
import { FaRegMessage } from "react-icons/fa6";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaPinterest,
} from "react-icons/fa";
import {
  IoClose,
  IoLocationSharp,
  IoMailSharp,
  IoCallSharp,
} from "react-icons/io5";
import { BsClock } from "react-icons/bs";

// Modal Component
const ContentModal = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative z-[10000]">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors relative z-[10001]"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="prose prose-lg max-w-none">{content}</div>
        </div>
      </div>
    </div>
  );
};

// Content data
const modalContents = {
  about: (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 rounded-xl">
        <h3 className="text-2xl font-bold mb-2">Welcome to Pickora</h3>
        <p className="text-red-50">
          Your Premium Shopping Destination Since 2020
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl">
        <p className="text-gray-700 leading-relaxed">
          Founded in 2020, Pickora has grown from a small startup to one of the
          leading e-commerce platforms in the industry. We're dedicated to
          providing you with the very best products, with a focus on quality,
          customer service, and uniqueness.
        </p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
        <h4 className="text-xl font-bold text-blue-900 mb-3">Our Mission</h4>
        <p className="text-blue-800">
          To make online shopping accessible, enjoyable, and secure for
          everyone. We believe in creating a marketplace where quality meets
          affordability.
        </p>
      </div>

      <div>
        <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">
            ✓
          </span>
          What Sets Us Apart
        </h4>
        <div className="grid gap-3">
          {[
            "Curated selection of premium products",
            "24/7 customer support",
            "Secure payment processing",
            "Fast and reliable shipping",
            "30-day money-back guarantee",
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-green-500 mr-3">✓</span>
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),

  vision: (
    <div className="space-y-6">
      <div className="text-center py-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
        <h3 className="text-3xl font-bold text-purple-900 mb-4">Our Vision</h3>
        <p className="text-purple-700 max-w-2xl mx-auto px-6 text-lg">
          To become the world's most customer-centric e-commerce company, where
          customers can find and discover anything they might want to buy online
          at the best possible prices.
        </p>
      </div>

      <div>
        <h4 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Core Values
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              title: "Customer First",
              desc: "Every decision we make starts with the customer",
              color: "bg-blue-500",
              bgColor: "bg-blue-50",
              icon: "👥",
            },
            {
              title: "Innovation",
              desc: "We constantly evolve to meet changing needs",
              color: "bg-green-500",
              bgColor: "bg-green-50",
              icon: "💡",
            },
            {
              title: "Integrity",
              desc: "We do the right thing, even when no one is watching",
              color: "bg-purple-500",
              bgColor: "bg-purple-50",
              icon: "🤝",
            },
            {
              title: "Sustainability",
              desc: "We're committed to reducing our environmental impact",
              color: "bg-emerald-500",
              bgColor: "bg-emerald-50",
              icon: "🌱",
            },
          ].map((value, index) => (
            <div
              key={index}
              className={`${value.bgColor} p-5 rounded-xl border-2 border-transparent hover:border-gray-200 transition-all`}
            >
              <div className="flex items-start">
                <span className="text-2xl mr-3">{value.icon}</span>
                <div>
                  <h5 className={`font-bold text-gray-800 mb-1`}>
                    {value.title}
                  </h5>
                  <p className="text-gray-600 text-sm">{value.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),

  terms: (
    <div className="space-y-6">
      <div className="bg-gray-900 text-white p-6 rounded-xl">
        <h3 className="text-2xl font-bold mb-2">Terms and Conditions</h3>
        <p className="text-gray-300 text-sm">Last updated: January 2025</p>
      </div>

      <div className="space-y-6">
        {[
          {
            number: "1",
            title: "Acceptance of Terms",
            content:
              "By accessing and using Pickora, you accept and agree to be bound by the terms and provision of this agreement.",
          },
          {
            number: "2",
            title: "Use License",
            content:
              "Permission is granted to temporarily download one copy of the materials on Pickora for personal, non-commercial transitory viewing only.",
          },
          {
            number: "3",
            title: "Disclaimer",
            content:
              "The materials on Pickora are provided on an 'as is' basis. Pickora makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.",
          },
        ].map((term, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start">
              <span className="bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                {term.number}
              </span>
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">
                  {term.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">{term.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),

  privacy: (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-8 rounded-xl text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h3 className="text-2xl font-bold mb-2">Privacy Policy</h3>
        <p className="text-indigo-100">Your privacy is important to us.</p>
      </div>

      <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-6">
        <h4 className="text-xl font-bold text-indigo-900 mb-4 flex items-center">
          <span className="bg-indigo-500 text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm">
            i
          </span>
          Information We Collect
        </h4>
        <div className="space-y-2">
          {[
            "Personal identification information (Name, email address, phone number, etc.)",
            "Payment information (processed securely through our payment partners)",
            "Browsing and purchase history",
          ].map((item, index) => (
            <div key={index} className="flex items-start">
              <span className="text-indigo-500 mt-1 mr-2">•</span>
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
        <h4 className="text-xl font-bold text-green-900 mb-4 flex items-center">
          <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm">
            ✓
          </span>
          How We Use Your Information
        </h4>
        <div className="space-y-2">
          {[
            "To process and fulfill your orders",
            "To improve customer service",
            "To send periodic emails regarding your order or other products and services",
          ].map((item, index) => (
            <div key={index} className="flex items-start">
              <span className="text-green-500 mt-1 mr-2">•</span>
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
        <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
          <span className="text-2xl mr-2">🛡️</span>
          Data Protection
        </h4>
        <p className="text-gray-700 leading-relaxed">
          We implement a variety of security measures to maintain the safety of
          your personal information. Your data is stored in secured networks and
          is only accessible by a limited number of persons who have special
          access rights.
        </p>
      </div>
    </div>
  ),

  shipping: (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-8 rounded-xl">
        <div className="text-5xl mb-4 text-center">📦</div>
        <h3 className="text-2xl font-bold text-center">Shipping Policy</h3>
      </div>

      <div className="bg-green-100 border-2 border-green-300 rounded-xl p-6">
        <h4 className="text-xl font-bold text-green-800 mb-3 flex items-center">
          <span className="text-2xl mr-2">🎉</span>
          Free Shipping
        </h4>
        <p className="text-green-700">
          Enjoy free standard shipping on all orders over $100. No coupon code
          required - discount automatically applied at checkout.
        </p>
      </div>

      <div>
        <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="text-2xl mr-2">⏱️</span>
          Shipping Times
        </h4>
        <div className="grid gap-3">
          {[
            {
              type: "Standard Shipping",
              time: "5-7 business days",
              color: "bg-blue-50 border-blue-200",
            },
            {
              type: "Express Shipping",
              time: "2-3 business days",
              color: "bg-orange-50 border-orange-200",
            },
            {
              type: "Overnight Shipping",
              time: "1 business day",
              color: "bg-red-50 border-red-200",
            },
          ].map((shipping, index) => (
            <div
              key={index}
              className={`${shipping.color} border-2 p-4 rounded-lg flex justify-between items-center`}
            >
              <span className="font-semibold text-gray-800">
                {shipping.type}
              </span>
              <span className="text-gray-600">{shipping.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-purple-50 p-6 rounded-xl">
        <h4 className="text-xl font-bold text-purple-900 mb-3 flex items-center">
          <span className="text-2xl mr-2">🌍</span>
          International Shipping
        </h4>
        <p className="text-purple-800">
          We ship to over 100 countries worldwide. International shipping rates
          and delivery times vary by destination.
        </p>
      </div>
    </div>
  ),

  returns: (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-teal-500 to-green-500 text-white p-8 rounded-xl text-center">
        <div className="text-5xl mb-4">↩️</div>
        <h3 className="text-2xl font-bold mb-2">Return Policy</h3>
        <p className="text-teal-50">
          We want you to be completely satisfied with your purchase. If you're
          not happy, we're not happy.
        </p>
      </div>

      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6">
        <h4 className="text-xl font-bold text-yellow-900 mb-3 flex items-center">
          <span className="text-2xl mr-2">📅</span>
          7-Day Return Window
        </h4>
        <p className="text-yellow-800">
          You have 7 days from the date of delivery to initiate a return. Items
          must be unused, in original packaging, and with all tags attached.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="text-2xl mr-2">📋</span>
          How to Return
        </h4>
        <div className="space-y-3">
          {[
            'Log into your account and go to "My Orders"',
            "Select the item(s) you wish to return",
            "Print the prepaid return label",
            "Pack the item securely and attach the label",
            "Drop off at any authorized shipping location",
          ].map((step, index) => (
            <div key={index} className="flex items-start">
              <span className="bg-teal-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                {index + 1}
              </span>
              <span className="text-gray-700">{step}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
        <h4 className="text-xl font-bold text-green-800 mb-3 flex items-center">
          <span className="text-2xl mr-2">💰</span>
          Refund Process
        </h4>
        <p className="text-green-700">
          Once we receive your return, we'll process your refund within 3-5
          business days. Refunds will be issued to the original payment method.
        </p>
      </div>
    </div>
  ),
  payment: (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white p-8 rounded-xl text-center">
        <div className="text-5xl mb-4">🔐</div>
        <h3 className="text-2xl font-bold mb-2">Payment Security</h3>
        <p className="text-slate-200">
          Your payment security is our top priority. We use industry-leading
          encryption and security measures to protect your financial
          information.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 h-full">
          <h4 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">💳</span>
            Accepted Payment Methods
          </h4>
          <div className="space-y-3">
            {[
              "Visa, Mastercard, American Express, Discover",
              "Razorpay",
              "Apple Pay and Google Pay",
              "Pickora Gift Cards",
              "Buy now, pay later options (Klarna, Afterpay)",
            ].map((method, index) => (
              <div
                key={index}
                className="flex items-center bg-white p-3 rounded-lg shadow-sm"
              >
                <span className="text-blue-500 mr-3">•</span>
                <span className="text-gray-700">{method}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 h-full">
          <h4 className="text-xl font-bold text-emerald-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">🛡️</span>
            Security Features
          </h4>
          <div className="space-y-3">
            {[
              "256-bit SSL encryption",
              "PCI DSS compliant",
              "Fraud detection and prevention",
              "Secure tokenization of payment data",
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center bg-white p-3 rounded-lg shadow-sm"
              >
                <span className="text-emerald-500 mr-3">✓</span>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="text-6xl text-amber-500">🔒</div>
          <div>
            <h4 className="text-xl font-bold text-gray-800 mb-2">
              Our Commitment to Security
            </h4>
            <p className="text-gray-600">
              At Pickora, we're committed to protecting your payment
              information. We never store your full credit card details on our
              servers and use advanced security protocols to encrypt all
              transactions. Shop with confidence knowing your financial data is
              always protected.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 sm:p-6 rounded-xl text-center">
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
            alt="Visa"
            className="h-6 sm:h-8 md:h-10 object-contain max-w-[80px]"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
            alt="Mastercard"
            className="h-6 sm:h-8 md:h-10 object-contain max-w-[80px]"
          />
          <img
            src="https://razorpay.com/assets/razorpay-logo.svg"
            alt="Razorpay"
            className="h-6 sm:h-8 md:h-10 object-contain max-w-[100px]"
          />
        </div>
        <p className="text-gray-500 text-xs sm:text-sm">
          We partner with trusted payment processors to ensure secure
          transactions.
        </p>
      </div>
    </div>
  ),
};

const ContactUsPart = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    content: null,
  });
  const [email, setEmail] = useState("");

  const openModal = (title, contentKey) => {
    setModalContent({ title, content: modalContents[contentKey] });
    setModalOpen(true);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter submission
    alert(`Thank you for subscribing with email: ${email}`);
    setEmail("");
  };

  return (
    <>
      {/* Section 1: Features */}
      <section
        className="bg-gradient-to-b from-white to-gray-50 w-full py-16"
        id="contactus"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[
              {
                icon: <LiaShippingFastSolid />,
                title: "Free Shipping",
                text: "Orders Over $10",
                color: "text-blue-500",
                bgColor: "bg-blue-50",
              },
              {
                icon: <PiKeyReturnLight />,
                title: "Easy Returns",
                text: "7 Days Return Policy",
                color: "text-green-500",
                bgColor: "bg-green-50",
              },
              {
                icon: <MdOutlinePayment />,
                title: "Secure Payment",
                text: "100% Protected",
                color: "text-purple-500",
                bgColor: "bg-purple-50",
              },
              {
                icon: <GoGift />,
                title: "Special Offers",
                text: "Best Deals Daily",
                color: "text-orange-500",
                bgColor: "bg-orange-50",
              },
              {
                icon: <BiSupport />,
                title: "24/7 Support",
                text: "Dedicated Support",
                color: "text-red-500",
                bgColor: "bg-red-50",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group cursor-pointer"
                onClick={() => {
                  if (feature.title === "Free Shipping")
                    openModal("Shipping Policy", "shipping");
                  if (feature.title === "Easy Returns")
                    openModal("Return Policy", "returns");
                  if (feature.title === "Secure Payment")
                    openModal("Payment Security", "payment");
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`${feature.bgColor} p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div className={`text-3xl ${feature.color}`}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-red-500">Pickora</h3>
              <p className="text-gray-400">
                Your trusted online marketplace for quality products at
                unbeatable prices.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <IoLocationSharp className="text-red-500 text-xl" />
                  <span className="text-sm">
                    507-Union Trade Centre, France
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <IoMailSharp className="text-red-500 text-xl" />
                  <a
                    href="mailto:contactus@pickora.com"
                    className="text-sm hover:text-red-500 transition"
                  >
                    contactus@pickora.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <IoCallSharp className="text-red-500 text-xl" />
                  <span className="text-sm">(+91) 9876-543-210</span>
                </div>
                <div className="flex items-center gap-3">
                  <BsClock className="text-red-500 text-xl" />
                  <span className="text-sm">Mon - Sat: 9:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => openModal("About Pickora", "about")}
                    className="text-gray-400 hover:text-red-500 transition text-sm"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal("Our Vision", "vision")}
                    className="text-gray-400 hover:text-red-500 transition text-sm"
                  >
                    Our Vision
                  </button>
                </li>
                <li>
                  <Link
                    to="/products"
                    className="text-gray-400 hover:text-red-500 transition text-sm"
                  >
                    All Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/deals"
                    className="text-gray-400 hover:text-red-500 transition text-sm"
                  >
                    Today's Deals
                  </Link>
                </li>
                <li>
                  <Link
                    to="/new-arrivals"
                    className="text-gray-400 hover:text-red-500 transition text-sm"
                  >
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link
                    to="/best-sellers"
                    className="text-gray-400 hover:text-red-500 transition text-sm"
                  >
                    Best Sellers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => openModal("Shipping Policy", "shipping")}
                    className="text-gray-400 hover:text-red-500 transition text-sm"
                  >
                    Shipping Info
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal("Return Policy", "returns")}
                    className="text-gray-400 hover:text-red-500 transition text-sm"
                  >
                    Returns & Exchanges
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal("Terms and Conditions", "terms")}
                    className="text-gray-400 hover:text-red-500 transition text-sm"
                  >
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal("Privacy Policy", "privacy")}
                    className="text-gray-400 hover:text-red-500 transition text-sm"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="text-gray-400 hover:text-red-500 transition text-sm"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/size-guide"
                    className="text-gray-400 hover:text-red-500 transition text-sm"
                  >
                    Size Guide
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter & Social */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Stay Connected</h4>
              <p className="text-gray-400 text-sm mb-4">
                Subscribe to get special offers, free giveaways, and exclusive
                deals.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="mb-6">
                <div className="flex gap-0">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                    className="flex-1 min-w-0 px-3 py-2 bg-gray-800 text-white text-sm rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-500 text-white text-sm rounded-r-lg hover:bg-red-600 transition whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </div>
              </form>

              <div>
                <h5 className="text-sm font-semibold mb-3">Follow Us</h5>
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-500 transition"
                  >
                    <FaFacebook />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-500 transition"
                  >
                    <FaTwitter />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-500 transition"
                  >
                    <FaInstagram />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-500 transition"
                  >
                    <FaLinkedin />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-500 transition"
                  >
                    <FaYoutube />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-500 transition"
                  >
                    <FaPinterest />
                  </a>
                </div>
              </div>

              {/* Live Chat Widget */}
              <div className="mt-6 bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <FaRegMessage className="text-red-500 text-2xl" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Live Chat</p>
                    <p className="text-xs text-gray-400">We're online now!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Copyright */}
              <div className="text-sm text-gray-400 text-center md:text-left">
                © {new Date().getFullYear()}{" "}
                <span className="text-red-500 font-semibold">Pickora</span>. All
                rights reserved. Made with ❤️ in India
              </div>

              {/* Payment Methods */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400 mr-2">We Accept:</span>
                <div className="flex gap-2">
                  <div className="bg-white p-1 rounded">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                      alt="Visa"
                      className="h-6 w-auto"
                    />
                  </div>
                  <div className="bg-white p-1 rounded">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                      alt="Mastercard"
                      className="h-6 w-auto"
                    />
                  </div>
                  <div className="bg-white p-1 rounded">
                    <img
                      src="https://razorpay.com/assets/razorpay-logo.svg"
                      alt="PayPal"
                      className="h-6 w-auto"
                    />
                  </div>
                  <div className="bg-white p-1 rounded px-2">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg"
                      alt="Amex"
                      className="h-6 w-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal */}
      <ContentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalContent.title}
        content={modalContent.content}
      />
    </>
  );
};

export default ContactUsPart;
