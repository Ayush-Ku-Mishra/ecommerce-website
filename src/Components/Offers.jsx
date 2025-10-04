import React from "react";
import { IoPricetagOutline } from "react-icons/io5";

const Offers = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="bg-white rounded-xl shadow-md p-8 md:p-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
              <IoPricetagOutline className="text-purple-600 text-4xl" />
            </div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            No Offers Available
          </h1>
          
          <p className="text-gray-600 text-lg mb-6">
            We're currently preparing some amazing deals for you!
          </p>
          
          <div className="text-sm text-gray-500">
            <p>Check back soon for exclusive discounts, promotions, and special offers.</p>
            <p className="mt-2">We appreciate your patience!</p>
          </div>
          
          <div className="mt-10">
            <a 
              href="/" 
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offers;