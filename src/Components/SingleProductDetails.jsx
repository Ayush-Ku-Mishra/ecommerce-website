import React from 'react';
import { useParams } from 'react-router-dom';
import { products } from '../data/productItems';
import ProductImageGallery from './ProductImageGallery';

const SingleProductDetails = () => {
  const { id } = useParams();
  const product = products.find(item => item.id === Number(id));

  if (!product) {
    return <div className="text-center text-red-500 mt-10">Product not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 grid md:grid-cols-2 gap-10">
      {/* 🖼️ Image Section */}
      <ProductImageGallery images={product.images} />

      {/* 🔤 Description Section (To be built next) */}
      <div>
        <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
        <p className="text-gray-500 mb-4">Brand: {product.brand}</p>
        {/* Pricing, Rating, Add to Cart — will add later */}
      </div>
    </div>
  );
};

export default SingleProductDetails;
