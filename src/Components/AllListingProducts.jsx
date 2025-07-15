import React from 'react'
import Sidebar from './FashionSidebarFilter'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';


const AllListingProducts = () => {
  return (
      <section className='py-5'>
        <div>
            <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/" className='hover:text-red-400 transition'>
          Home
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href=""
          className='hover:text-red-400 transition'
        >
          Fashion
        </Link>
      </Breadcrumbs>
        </div>
        
        <div className='bg-red-500 p-3 mt-4'>
            <div className='container flex gap-3'>
            <div className='sidebarWrapper w-[20%] h-full bg-red-500'>
                <Sidebar/>
            </div>
        </div>
        </div>
      </section>
  )
}

export default AllListingProducts
