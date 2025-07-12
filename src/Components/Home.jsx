import React from 'react'
import HomeSlider from './HomeSlider'
import HomeCatSlider from './HomeCatSlider'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ProductSlider from './ProductSlider';



const Home = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>

       <HomeSlider/>
       <HomeCatSlider/>

       <section>

        <div className='flex items-center justify-between gap-40 mt-4 ml-16 mr-16'>
            <div >
                <h3 className='text-[20px] font-[600]'>Popular Products</h3>
                <p className='text-[14px] font-[400]'>Do not miss the current offers until the end of March.</p>
            </div>
            <div className='w-[58%]'>
                 <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                >
                    <Tab label="FASHION"/>
                    <Tab label="ELECTRONICS" />
                    <Tab label="BAGS" />
                    <Tab label="FOOTWEAR" />
                    <Tab label="GROCERIES" />
                    <Tab label="BEAUTY & HEALTH" />
                    <Tab label="FRUNITURES" />
                    <Tab label="JEWELLERY" />
                </Tabs>
            </div>
        </div>

        <div className='ml-16'>
          <ProductSlider/>
        </div>

       </section>

    </div>
  )
}

export default Home
