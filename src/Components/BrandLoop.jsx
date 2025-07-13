import React from 'react'

const BrandLoop = () => {
    const brands = [
    "https://images.meesho.com/images/marketing/1743159393231.webp",
    "https://images.meesho.com/images/marketing/1743159415385.webp",
    "https://images.meesho.com/images/marketing/1744636558884.webp",
    "https://images.meesho.com/images/marketing/1744636599446.webp",
    "https://images.meesho.com/images/marketing/1743159302944.webp",
    "https://images.meesho.com/images/marketing/1743159322237.webp",
    "https://images.meesho.com/images/marketing/1743159363205.webp",
    "https://images.meesho.com/images/marketing/1743159377598.webp"
  ];

   const loopedBrands = [...brands, ...brands];

  return (
    <div className="bg-[#f5eefd] py-6 overflow-hidden scroll-wrapper">
      <div className="scroll-marquee gap-6 px-6">
        {loopedBrands.map((url, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm min-w-[150px] flex items-center justify-center h-[100px]  hover:-translate-y-2 transition duration-300 ease-in-out brand-hover"
          >
            <img src={url} alt={`Brand ${index}`} className="h-12 object-contain" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default BrandLoop
