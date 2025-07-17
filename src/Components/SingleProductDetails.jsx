import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { products } from "../data/productItems"; // or your product source

const SingleProductDetails = () => {
  const { id } = useParams(); // get product ID from URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const found = products.find((item) => item.id === id);
    setProduct(found);
  }, [id]);

  if (!product) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-10">
      <img
        src={product.image}
        alt={product.name}
        className="w-full md:w-1/2 object-cover rounded-xl"
      />
      <div className="flex-1">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-xl text-green-600 mt-2 mb-4">₹{product.price}</p>
        <p className="text-gray-700 mb-6">{product.description}</p>
        <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default SingleProductDetails;
