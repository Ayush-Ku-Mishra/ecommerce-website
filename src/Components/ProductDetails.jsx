import React from 'react'
import { useParams } from 'react-router-dom'

const ProductDetails = () => {
    const {id} = useParams();

  return (
    <div>
      <h1 className="text-2xl font-bold">Product ID: {id}</h1>
    </div>
  )
}

export default ProductDetails
