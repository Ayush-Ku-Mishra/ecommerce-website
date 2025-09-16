import React from "react";
import HomeSlider from "./HomeSlider";
import HomeCatSlider from "./HomeCatSlider";
import ProductSlider from "./ProductSlider";
import HeadPhoneSlider from "./HeadPhoneSlider";
import BagSlider from "./BagSlider";
import ClientsPart from "./ClientsPart";
import ContactUsPart from "./ContactUsPart";
import { IoArrowForward } from "react-icons/io5";

const Home = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <div className="overflow-x-hidden">
        <HomeSlider />
      </div>
      <HomeCatSlider />

      <section>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-40 lg:mt-8 mt-2 mx-4 sm:mx-16">
          <div>
            <h3 className="text-md sm:text-[20px] font-[600] font-custom">
              Popular Products
            </h3>
            <p className="text-sm sm:text-[14px] font-[400]">
              Do not miss the current offers until the end of March.
            </p>
          </div>
        </div>

        <div className="ml-0 md:ml-8 lg:ml-16 mt-5 overflow-x-hidden">
          <ProductSlider />
        </div>

        <div className="lg:ml-16 lg:mt-14 mt-6 ml-0">
          <div className="flex items-center justify-between">
            <h3 className="lg:text-[22px] text-md font-[600] mb-4 font-custom ml-3">
            Audio Devices
          </h3>
          <IoArrowForward className="text-2xl text-gray-600 cursor-pointer hover:text-gray-900 transition lg:mr-9 mr-3" />
          </div>
          <HeadPhoneSlider />
        </div>

        <div className="lg:ml-16 lg:mt-10 mt-6 ml-4">
          <h3 className="lg:text-[22px] text-md font-[600] mb-4 font-custom">
            Bags
          </h3>
          <BagSlider />
        </div>

        <div className="lg:mt-10 mt-8 border-t mx-16 overflow-x-hidden">
          <ClientsPart />
        </div>
      </section>

      <section className="mt-12">
        <ContactUsPart />
      </section>
    </div>
  );
};

export default Home;
