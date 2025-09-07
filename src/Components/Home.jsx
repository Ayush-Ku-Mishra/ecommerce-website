import React from 'react'
import HomeSlider from './HomeSlider'
import HomeCatSlider from './HomeCatSlider'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ProductSlider from './ProductSlider';
import HomeSliderV2 from './HomeSliderV2';
import HeadPhoneSlider from './HeadPhoneSlider';
import BagSlider from './BagSlider';
import BrandLoop from './BrandLoop';
import ClientsPart from './ClientsPart';
import ContactUsPart from './ContactUsPart';

const Home = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <HomeSlider />
      <HomeCatSlider />

      <section>
        <div className='flex items-center justify-between gap-40 mt-8 ml-16 mr-16'>
          <div>
            <h3 className='text-[20px] font-[600] font-custom'>Popular Products</h3>
            <p className='text-[14px] font-[400]'>
              Do not miss the current offers until the end of March.
            </p>
          </div>
          
        </div>

        <div className='ml-16 mt-5'>
          <ProductSlider />
        </div>

        <div className='ml-16 mt-20 mr-16'>
          <HomeSliderV2 />
        </div>

        <div className='ml-16 mt-14'>
          <h3 className='text-[22px] font-[600] mb-4 font-custom'>Headphones</h3>
          <HeadPhoneSlider />
        </div>

        

        <div className='ml-16 mt-10'>
          <h3 className='text-[22px] font-[600] mb-4 font-custom'>Bags</h3>
          <BagSlider />
        </div>

        

        <div className='mt-10 border-t mx-16'>
          <ClientsPart />
        </div>
      </section>

      <section className='mt-12'>
        <ContactUsPart/>
      </section>
    </div>
  )
}

export default Home
