export const products = [
  {
    id: 1, // unique product group id
    orderId: "6887b583228db479bba3d66a",
    paymentId: "PAY987654",
    userName: "John Doe",
    phone: "9876543210",
    address:
      "APJ Abdul Kalam Hall Of Residency, CET college, Ghatikia, Bhubaneswar, Odisha - 751029 Bhubaneswar hi Odisha India",
    pincode: "110001",
    email: "amishra59137@gmail.com",
    status: "Delivered",
    userId: "USR001",
    category: ["popular", "fashion", "Men"],
    brand: "KAJARU",
    name: "Men Striped Round Neck Polycotton Brown T-Shirt",
    sizeChartImage:
      "https://i.etsystatic.com/27841497/r/il/d3487f/3784232713/il_fullxfull.3784232713_ac8w.jpg",
    deliveryDays: 3,
    defaultVariant: {
      color: "Brown",
      sizes: [
        { size: "S", inStock: true, stockQuantity: 6 },
        { size: "M", inStock: true, stockQuantity: 9 },
        { size: "L", inStock: true, stockQuantity: 15 },
        { size: "XL", inStock: false, stockQuantity: 0 },
        { size: "2XL", inStock: true, stockQuantity: 3 },
        { size: "3XL", inStock: false, stockQuantity: 0 },
      ],
    },

    images: [
      "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/2/z/g/m-oversizetsrt-114-kajaru-original-imah82szb2j8fxg3.jpeg?q=70",
      "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/j/m/y/m-oversizetsrt-114-kajaru-original-imah82szzkgz9wgd.jpeg?q=70",
    ],

    discount: "69%",
    originalPrice: 999,
    discountedPrice: 304,
    rating: 4.2, // average rating of all variants
    totalReviews: 45, // total verified reviews across all variants
    gender: "Men",
    subcategory: ["T-Shirts", "Men"],

    variants: [
      {
        id: "1",
        color: "Brown",
        sizes: [
          { size: "S", inStock: true, stockQuantity: 6 },
          { size: "M", inStock: true, stockQuantity: 9 },
          { size: "L", inStock: true, stockQuantity: 15 },
          { size: "XL", inStock: false, stockQuantity: 0 },
          { size: "2XL", inStock: true, stockQuantity: 3 },
          { size: "3XL", inStock: false, stockQuantity: 0 },
        ],
        stockQuantity: 0,
        inStock: false,
        originalPrice: 999,
        discountedPrice: 300,
        discount: "69%",
        images: [
          "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/2/z/g/m-oversizetsrt-114-kajaru-original-imah82szb2j8fxg3.jpeg?q=70",
          "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/j/m/y/m-oversizetsrt-114-kajaru-original-imah82szzkgz9wgd.jpeg?q=70",
        ],
      },
      {
        id: "1-Maroon",
        color: "Maroon",
        sizes: [
          { size: "S", inStock: true, stockQuantity: 6 },
          { size: "M", inStock: true, stockQuantity: 9 },
          { size: "L", inStock: true, stockQuantity: 15 },
          { size: "XL", inStock: false, stockQuantity: 0 },
          { size: "2XL", inStock: true, stockQuantity: 3 },
          { size: "3XL", inStock: false, stockQuantity: 0 },
        ],
        stockQuantity: 6,
        inStock: true,
        originalPrice: 950,
        discountedPrice: 304,
        discount: "69%",
        images: [
          "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/i/g/w/m-oversizetsrt-114-kajaru-original-imah8ysqz3cgvdwe.jpeg?q=70",
          "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/p/e/1/m-oversizetsrt-114-kajaru-original-imah8ysqch75p7jn.jpeg?q=70",
        ],
      },
      {
        id: "1-Grey",
        color: "Grey",
        sizes: [
          { size: "S", inStock: true, stockQuantity: 6 },
          { size: "M", inStock: true, stockQuantity: 9 },
          { size: "L", inStock: true, stockQuantity: 15 },
          { size: "XL", inStock: false, stockQuantity: 0 },
          { size: "2XL", inStock: true, stockQuantity: 3 },
          { size: "3XL", inStock: false, stockQuantity: 0 },
        ],
        stockQuantity: 6,
        inStock: true,
        originalPrice: 999,
        discountedPrice: 279,
        discount: "72%",
        images: [
          "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/5/m/h/xxl-oversizetsrt-114-kajaru-original-imah93gn5j7kntgc.jpeg?q=70",
          "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/h/x/e/xl-oversizetsrt-114-kajaru-original-imah93gmr5y2y6hg.jpeg?q=70",
        ],
      },
    ],

    productDetails: [
      { label: "Brand", value: "VeBNoR" },
      { label: "Type", value: "Polo Neck" },
      { label: "Sleeve", value: "Half Sleeve" },
      { label: "Fit", value: "Regular" },
      { label: "Fabric", value: "Polyester" },
      { label: "Sales Package", value: "1 Tshirt" },
      { label: "Pack of", value: "1" },
      { label: "Neck Type", value: "Polo Neck" },
      { label: "Ideal For", value: "Men" },
      { label: "Size", value: "S" },
      { label: "Brand Color", value: "Mustard" },
      { label: "Occasion", value: "Casual" },
      { label: "Tee Length", value: "Medium" },
      {
        label: "Trend",
        value: "Sports, Solid pique Polo, Knits, Sports Chic, Solids",
      },
    ],
  },
  {
    id: 2, // unique product group id
    category: ["popular", "fashion", "Men"],
    brand: "KAJARU",
    name: "Men Printed Round Neck Polycotton T-Shirt",
    sizeChartImage:
      "https://i.etsystatic.com/27841497/r/il/d3487f/3784232713/il_fullxfull.3784232713_ac8w.jpg",
    deliveryDays: 3,
    defaultVariant: {
      color: "Blue",
      sizes: [
        { size: "S", inStock: true, stockQuantity: 6 },
        { size: "M", inStock: true, stockQuantity: 9 },
        { size: "L", inStock: true, stockQuantity: 15 },
        { size: "XL", inStock: false, stockQuantity: 0 },
        { size: "2XL", inStock: true, stockQuantity: 3 },
        { size: "3XL", inStock: false, stockQuantity: 0 },
      ],
    },

    images: [
      "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/z/h/t/s-oversizetsrt-101-makemode-original-imah4u23haspx9zg.jpeg?q=70",
      "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/s/6/r/s-oversizetsrt-101-makemode-original-imah4u23yhrhkpu2.jpeg?q=70",
    ],

    discount: "80%",
    originalPrice: 1399,
    discountedPrice: 271,
    rating: 4.2, // average rating of all variants
    totalReviews: 45, // total verified reviews across all variants
    gender: "Men",
    subcategory: ["T-Shirts", "Men"],

    variants: [
      {
        id: "2",
        color: "Blue",
        sizes: [
          { size: "S", inStock: true, stockQuantity: 6 },
          { size: "M", inStock: true, stockQuantity: 9 },
          { size: "L", inStock: true, stockQuantity: 15 },
          { size: "XL", inStock: false, stockQuantity: 0 },
          { size: "2XL", inStock: true, stockQuantity: 3 },
          { size: "3XL", inStock: false, stockQuantity: 0 },
        ],
        stockQuantity: 0,
        inStock: false,
        originalPrice: 1399,
        discountedPrice: 271,
        discount: "80%",
        images: [
          "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/z/h/t/s-oversizetsrt-101-makemode-original-imah4u23haspx9zg.jpeg?q=70",
          "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/s/6/r/s-oversizetsrt-101-makemode-original-imah4u23yhrhkpu2.jpeg?q=70",
        ],
      },
      {
        id: "2-green",
        color: "Green",
        sizes: [
          { size: "S", inStock: true, stockQuantity: 6 },
          { size: "M", inStock: true, stockQuantity: 9 },
          { size: "L", inStock: true, stockQuantity: 15 },
          { size: "XL", inStock: false, stockQuantity: 0 },
          { size: "2XL", inStock: true, stockQuantity: 3 },
          { size: "3XL", inStock: false, stockQuantity: 0 },
        ],
        stockQuantity: 6,
        inStock: true,
        originalPrice: 1399,
        discountedPrice: 236,
        discount: "83%",
        images: [
          "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/z/r/l/s-oversizetsrt-106-kajaru-original-imahffygtvyn2pxk.jpeg?q=70",
          "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/a/v/5/s-oversizetsrt-106-kajaru-original-imahffygd3gttdcg.jpeg?q=70",
        ],
      },
    ],

    productDetails: [
      { label: "Brand", value: "VeBNoR" },
      { label: "Type", value: "Polo Neck" },
      { label: "Sleeve", value: "Half Sleeve" },
      { label: "Fit", value: "Regular" },
      { label: "Fabric", value: "Polyester" },
      { label: "Sales Package", value: "1 Tshirt" },
      { label: "Pack of", value: "1" },
      { label: "Neck Type", value: "Polo Neck" },
      { label: "Ideal For", value: "Men" },
      { label: "Size", value: "S" },
      { label: "Brand Color", value: "Mustard" },
      { label: "Occasion", value: "Casual" },
      { label: "Tee Length", value: "Medium" },
      {
        label: "Trend",
        value: "Sports, Solid pique Polo, Knits, Sports Chic, Solids",
      },
    ],
  },
  {
    id: 3, // unique product group id
    category: ["popular", "fashion", "Men"],
    brand: "Campus Sutra",
    name: "Men Comfort Cuban Collar Solid Polycotton Casual T-Shirt",
    sizeChartImage:
      "https://i.etsystatic.com/27841497/r/il/d3487f/3784232713/il_fullxfull.3784232713_ac8w.jpg",
    deliveryDays: 3,
    defaultVariant: {
      color: "Yellow",
      sizes: [
        { size: "S", inStock: true, stockQuantity: 6 },
        { size: "M", inStock: true, stockQuantity: 9 },
        { size: "L", inStock: true, stockQuantity: 15 },
        { size: "XL", inStock: false, stockQuantity: 0 },
        { size: "2XL", inStock: true, stockQuantity: 3 },
        { size: "3XL", inStock: false, stockQuantity: 0 },
      ],
    },

    images: [
      "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/1/7/q/xxl-ts110-vebnor-original-imahd7zam2qsfzj2.jpeg?q=70",
      "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/j/j/v/xxl-ts110-vebnor-original-imahd7zazgqrpcvf.jpeg?q=70",
    ],

    discount: "14%",
    originalPrice: 999,
    discountedPrice: 258,
    rating: 4.2, // average rating of all variants
    totalReviews: 45, // total verified reviews across all variants
    gender: "Men",
    subcategory: ["T-Shirts", "Men"],

    variants: [
      {
        id: "3",
        color: "Yellow",
        sizes: [
          { size: "S", inStock: true, stockQuantity: 6 },
          { size: "M", inStock: true, stockQuantity: 9 },
          { size: "L", inStock: true, stockQuantity: 15 },
          { size: "XL", inStock: false, stockQuantity: 0 },
          { size: "2XL", inStock: true, stockQuantity: 3 },
          { size: "3XL", inStock: false, stockQuantity: 0 },
        ],
        stockQuantity: 0,
        inStock: false,
        originalPrice: 999,
        discountedPrice: 258,
        discount: "14%",
        images: [
          "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/1/7/q/xxl-ts110-vebnor-original-imahd7zam2qsfzj2.jpeg?q=70",
          "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/j/j/v/xxl-ts110-vebnor-original-imahd7zazgqrpcvf.jpeg?q=70",
        ],
      },
      {
        id: "3-green",
        color: "Green",
        sizes: [
          { size: "S", inStock: true, stockQuantity: 6 },
          { size: "M", inStock: true, stockQuantity: 9 },
          { size: "L", inStock: true, stockQuantity: 15 },
          { size: "XL", inStock: false, stockQuantity: 0 },
          { size: "2XL", inStock: true, stockQuantity: 3 },
          { size: "3XL", inStock: false, stockQuantity: 0 },
        ],
        stockQuantity: 6,
        inStock: true,
        originalPrice: 950,
        discountedPrice: 250,
        discount: "15%",
        images: [
          "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/7/a/z/xl-ts36-vebnor-original-imahbyggbtzhfehy.jpeg?q=70",
          "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/e/w/r/xl-ts36-vebnor-original-imahbyggvcfru4p8.jpeg?q=70",
        ],
      },
      {
        id: "3-pink",
        color: "Pink",
        sizes: [
          { size: "S", inStock: true, stockQuantity: 6 },
          { size: "M", inStock: true, stockQuantity: 9 },
          { size: "L", inStock: true, stockQuantity: 15 },
          { size: "XL", inStock: false, stockQuantity: 0 },
          { size: "2XL", inStock: true, stockQuantity: 3 },
          { size: "3XL", inStock: false, stockQuantity: 0 },
        ],
        stockQuantity: 6,
        inStock: true,
        originalPrice: 800,
        discountedPrice: 300,
        discount: "16%",
        images: [
          "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/3/2/j/xl-ts36-vebnor-original-imahbyhrhfwdzptd.jpeg?q=70",
          "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/v/t/0/xl-ts36-vebnor-original-imahbyhrygufzfw4.jpeg?q=70",
        ],
      },
      {
        id: "3-sky-blue",
        color: "Sky Blue",
        sizes: [
          { size: "S", inStock: true, stockQuantity: 6 },
          { size: "M", inStock: true, stockQuantity: 9 },
          { size: "L", inStock: true, stockQuantity: 15 },
          { size: "XL", inStock: false, stockQuantity: 0 },
          { size: "2XL", inStock: true, stockQuantity: 3 },
          { size: "3XL", inStock: false, stockQuantity: 0 },
        ],
        stockQuantity: 6,
        inStock: true,
        originalPrice: 800,
        discountedPrice: 300,
        discount: "16%",
        images: [
          "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/u/c/a/m-ts36-vebnor-original-imahbygkxvkufybj.jpeg?q=70",
        ],
      },
      {
        id: "3-light-grey",
        color: "Light Grey",
        sizes: [
          { size: "S", inStock: true, stockQuantity: 6 },
          { size: "M", inStock: true, stockQuantity: 9 },
          { size: "L", inStock: true, stockQuantity: 15 },
          { size: "XL", inStock: false, stockQuantity: 0 },
          { size: "2XL", inStock: true, stockQuantity: 3 },
          { size: "3XL", inStock: false, stockQuantity: 0 },
        ],
        stockQuantity: 6,
        inStock: true,
        originalPrice: 800,
        discountedPrice: 300,
        discount: "16%",
        images: [
          "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/5/r/e/s-ts36-vebnor-original-imahbyg4fcrskaxv.jpeg?q=70",
        ],
      },
      {
        id: "3-light-green",
        color: "Light Green",
        sizes: [
          { size: "S", inStock: true, stockQuantity: 6 },
          { size: "M", inStock: true, stockQuantity: 9 },
          { size: "L", inStock: true, stockQuantity: 15 },
          { size: "XL", inStock: false, stockQuantity: 0 },
          { size: "2XL", inStock: true, stockQuantity: 3 },
          { size: "3XL", inStock: false, stockQuantity: 0 },
        ],
        stockQuantity: 6,
        inStock: true,
        originalPrice: 800,
        discountedPrice: 300,
        discount: "16%",
        images: [
          "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/t/w/t/l-ts36-vebnor-original-imahbygfenkenj4q.jpeg?q=70",
        ],
      },
      {
        id: "3-navy-blue",
        color: "Navy Blue",
        sizes: [
          { size: "S", inStock: true, stockQuantity: 6 },
          { size: "M", inStock: true, stockQuantity: 9 },
          { size: "L", inStock: true, stockQuantity: 15 },
          { size: "XL", inStock: false, stockQuantity: 0 },
          { size: "2XL", inStock: true, stockQuantity: 3 },
          { size: "3XL", inStock: false, stockQuantity: 0 },
        ],
        stockQuantity: 6,
        inStock: true,
        originalPrice: 800,
        discountedPrice: 300,
        discount: "16%",
        images: [
          "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/s/o/p/3xl-ts36-vebnor-original-imahbygbxz5b7aqq.jpeg?q=70",
        ],
      },
      {
        id: "3-denim-blue",
        color: "Denim Blue",
        sizes: [
          { size: "S", inStock: true, stockQuantity: 6 },
          { size: "M", inStock: true, stockQuantity: 9 },
          { size: "L", inStock: true, stockQuantity: 15 },
          { size: "XL", inStock: false, stockQuantity: 0 },
          { size: "2XL", inStock: true, stockQuantity: 3 },
          { size: "3XL", inStock: false, stockQuantity: 0 },
        ],
        stockQuantity: 6,
        inStock: true,
        originalPrice: 800,
        discountedPrice: 300,
        discount: "16%",
        images: [
          "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/h/s/z/m-ts110-vebnor-original-imahd7zauwtsdgx6.jpeg?q=70",
        ],
      },
      {
        id: "3-dark-grey",
        color: "Dark Grey",
        sizes: [
          { size: "S", inStock: true, stockQuantity: 6 },
          { size: "M", inStock: true, stockQuantity: 9 },
          { size: "L", inStock: true, stockQuantity: 15 },
          { size: "XL", inStock: false, stockQuantity: 0 },
          { size: "2XL", inStock: true, stockQuantity: 3 },
          { size: "3XL", inStock: false, stockQuantity: 0 },
        ],
        stockQuantity: 6,
        inStock: true,
        originalPrice: 800,
        discountedPrice: 300,
        discount: "16%",
        images: [
          "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/p/k/t/l-ts103-vebnor-original-imahagh42pwcrz5k.jpeg?q=70",
        ],
      },
      {
        id: "3-dark-orange",
        color: "Dark Orange",
        sizes: [
          { size: "S", inStock: true, stockQuantity: 6 },
          { size: "M", inStock: true, stockQuantity: 9 },
          { size: "L", inStock: true, stockQuantity: 15 },
          { size: "XL", inStock: false, stockQuantity: 0 },
          { size: "2XL", inStock: true, stockQuantity: 3 },
          { size: "3XL", inStock: false, stockQuantity: 0 },
        ],
        stockQuantity: 6,
        inStock: true,
        originalPrice: 800,
        discountedPrice: 300,
        discount: "16%",
        images: [
          "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/e/f/q/l-ts110-vebnor-original-imahd7zatw8akjyw.jpeg?q=70",
        ],
      },
      {
        id: "3-brown",
        color: "Brown",
        sizes: [
          { size: "S", inStock: true, stockQuantity: 6 },
          { size: "M", inStock: true, stockQuantity: 9 },
          { size: "L", inStock: true, stockQuantity: 15 },
          { size: "XL", inStock: false, stockQuantity: 0 },
          { size: "2XL", inStock: true, stockQuantity: 3 },
          { size: "3XL", inStock: false, stockQuantity: 0 },
        ],
        stockQuantity: 6,
        inStock: true,
        originalPrice: 800,
        discountedPrice: 300,
        discount: "16%",
        images: [
          "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/v/f/u/l-ts36-vebnor-original-imahd3xg9cesvumx.jpeg?q=70",
        ],
      },
    ],

    productDetails: [
      { label: "Brand", value: "VeBNoR" },
      { label: "Type", value: "Polo Neck" },
      { label: "Sleeve", value: "Half Sleeve" },
      { label: "Fit", value: "Regular" },
      { label: "Fabric", value: "Polyester" },
      { label: "Sales Package", value: "1 Tshirt" },
      { label: "Pack of", value: "1" },
      { label: "Neck Type", value: "Polo Neck" },
      { label: "Ideal For", value: "Men" },
      { label: "Size", value: "S" },
      { label: "Brand Color", value: "Mustard" },
      { label: "Occasion", value: "Casual" },
      { label: "Tee Length", value: "Medium" },
      {
        label: "Trend",
        value: "Sports, Solid pique Polo, Knits, Sports Chic, Solids",
      },
    ],
  },
  {
    id: 4, // unique product group id
    category: ["popular", "fashion", "Men"],
    brand: "HERE&NOW",
    name: "Men Slim Fit Printed Casual Shirt",
    sizeChartImage:
      "https://i.etsystatic.com/27841497/r/il/d3487f/3784232713/il_fullxfull.3784232713_ac8w.jpg",
    deliveryDays: 3,
    defaultVariant: {
      color: "Blue",
      sizes: [
        { size: "S", inStock: true, stockQuantity: 6 },
        { size: "M", inStock: true, stockQuantity: 9 },
        { size: "L", inStock: true, stockQuantity: 15 },
        { size: "XL", inStock: false, stockQuantity: 0 },
        { size: "2XL", inStock: true, stockQuantity: 3 },
        { size: "3XL", inStock: false, stockQuantity: 0 },
      ],
    },

    images: [
      "https://rukminim2.flixcart.com/image/612/612/xif0q/shirt/l/n/r/xl-25975764-here-now-original-imah4zzjbycfqbaa.jpeg?q=70",
      "https://rukminim2.flixcart.com/image/612/612/xif0q/shirt/i/8/m/xl-25975764-here-now-original-imah4zzj7nzq4jah.jpeg?q=70",
    ],

    discount: "65%",
    originalPrice: 1999,
    discountedPrice: 699,
    rating: 4.2, // average rating of all variants
    totalReviews: 50, // total verified reviews across all variants
    gender: "Men",
    subcategory: ["Shirts", "Men"],

    variants: [
      {
        id: "4",
        color: "Blue",
        sizes: [
          { size: "S", inStock: true, stockQuantity: 6 },
          { size: "M", inStock: true, stockQuantity: 9 },
          { size: "L", inStock: true, stockQuantity: 15 },
          { size: "XL", inStock: false, stockQuantity: 0 },
          { size: "2XL", inStock: true, stockQuantity: 3 },
          { size: "3XL", inStock: false, stockQuantity: 0 },
        ],
        stockQuantity: 0,
        inStock: false,
        originalPrice: 1999,
        discountedPrice: 699,
        discount: "65%",
        images: [
          "https://rukminim2.flixcart.com/image/612/612/xif0q/shirt/l/n/r/xl-25975764-here-now-original-imah4zzjbycfqbaa.jpeg?q=70",
          "https://rukminim2.flixcart.com/image/612/612/xif0q/shirt/i/8/m/xl-25975764-here-now-original-imah4zzj7nzq4jah.jpeg?q=70",
        ],
      },
    ],

    productDetails: [
      { label: "Brand", value: "VeBNoR" },
      { label: "Type", value: "Polo Neck" },
      { label: "Sleeve", value: "Half Sleeve" },
      { label: "Fit", value: "Regular" },
      { label: "Fabric", value: "Polyester" },
      { label: "Sales Package", value: "1 Tshirt" },
      { label: "Pack of", value: "1" },
      { label: "Neck Type", value: "Polo Neck" },
      { label: "Ideal For", value: "Men" },
      { label: "Size", value: "S" },
      { label: "Brand Color", value: "Mustard" },
      { label: "Occasion", value: "Casual" },
      { label: "Tee Length", value: "Medium" },
      {
        label: "Trend",
        value: "Sports, Solid pique Polo, Knits, Sports Chic, Solids",
      },
    ],
  },
  {
    id: 5, // unique product group id
    category: ["popular", "fashion", "Women"],
    brand: "KAKADIYA CREATION",
    name: "Men Comfort Cuban Collar Solid Polycotton Casual T-Shirt",
    sizeChartImage:
      "https://i.etsystatic.com/27841497/r/il/d3487f/3784232713/il_fullxfull.3784232713_ac8w.jpg",
    deliveryDays: 3,
    defaultVariant: {
      color: "Green",
      sizes: [
        
      ],
    },

    images: [
      "https://rukminim2.flixcart.com/image/612/612/xif0q/sari/1/a/4/free-green-saree-kakadiya-creation-unstitched-original-imahe5hpkahbfxgf.jpeg?q=70",
      "https://rukminim2.flixcart.com/image/612/612/xif0q/sari/n/y/m/free-green-saree-kakadiya-creation-unstitched-original-imahe5hptcgejyzk.jpeg?q=70",
    ],

    discount: "88%",
    originalPrice: 3299,
    discountedPrice: 395,
    rating: 4.2, // average rating of all variants
    totalReviews: 369, // total verified reviews across all variants
    gender: "Women",
    subcategory: ["Sarees", "Women"],

    variants: [
      {
        id: "5",
        color: "Green",
        sizes: [
          
        ],
        stockQuantity: 0,
        inStock: false,
        originalPrice: 3299,
        discountedPrice: 395,
        discount: "88%",
        images: [
          "https://rukminim2.flixcart.com/image/612/612/xif0q/sari/1/a/4/free-green-saree-kakadiya-creation-unstitched-original-imahe5hpkahbfxgf.jpeg?q=70",
          "https://rukminim2.flixcart.com/image/612/612/xif0q/sari/n/y/m/free-green-saree-kakadiya-creation-unstitched-original-imahe5hptcgejyzk.jpeg?q=70",
        ],
      },
    ],

    productDetails: [
      { label: "Brand", value: "VeBNoR" },
      { label: "Type", value: "Polo Neck" },
      { label: "Sleeve", value: "Half Sleeve" },
      { label: "Fit", value: "Regular" },
      { label: "Fabric", value: "Polyester" },
      { label: "Sales Package", value: "1 Tshirt" },
      { label: "Pack of", value: "1" },
      { label: "Neck Type", value: "Polo Neck" },
      { label: "Ideal For", value: "Men" },
      { label: "Size", value: "S" },
      { label: "Brand Color", value: "Mustard" },
      { label: "Occasion", value: "Casual" },
      { label: "Tee Length", value: "Medium" },
      {
        label: "Trend",
        value: "Sports, Solid pique Polo, Knits, Sports Chic, Solids",
      },
    ],
  },
  {
    id: 6, // unique product group id
    category: ["popular", "fashion", "Women"],
    brand: "Dream Beauty Fashion",
    name: "Casual Regular Sleeves Solid Women Top",
    sizeChartImage:
      "https://i.etsystatic.com/27841497/r/il/d3487f/3784232713/il_fullxfull.3784232713_ac8w.jpg",
    deliveryDays: 3,
    defaultVariant: {
      color: "Brown",
      sizes: [
        { size: "S", inStock: true, stockQuantity: 6 },
        { size: "M", inStock: true, stockQuantity: 9 },
        { size: "L", inStock: true, stockQuantity: 15 },
        { size: "XL", inStock: false, stockQuantity: 0 },
        { size: "2XL", inStock: true, stockQuantity: 3 },
        { size: "3XL", inStock: false, stockQuantity: 0 },
      ],
    },

    images: [
      "https://rukminim2.flixcart.com/image/612/612/xif0q/top/s/q/w/xs-top-apple-new-coffee-dream-beauty-fashion-original-imah2gg3uesufvfx.jpeg?q=70",
      "https://rukminim2.flixcart.com/image/612/612/xif0q/top/v/x/h/xs-top-apple-new-coffee-dream-beauty-fashion-original-imah2gg38u3mgths.jpeg?q=70",
    ],

    discount: "77%",
    originalPrice: 999,
    discountedPrice: 224,
    rating: 4.2, // average rating of all variants
    totalReviews: 1136, // total verified reviews across all variants
    gender: "Women",
    subcategory: ["Tops", "Women"],

    variants: [
      {
        id: "6",
        color: "Brown",
        sizes: [
          { size: "S", inStock: true, stockQuantity: 6 },
          { size: "M", inStock: true, stockQuantity: 9 },
          { size: "L", inStock: true, stockQuantity: 15 },
          { size: "XL", inStock: false, stockQuantity: 0 },
          { size: "2XL", inStock: true, stockQuantity: 3 },
          { size: "3XL", inStock: false, stockQuantity: 0 },
        ],
        stockQuantity: 0,
        inStock: false,
        originalPrice: 999,
        discountedPrice: 224,
        discount: "77%",
        images: [
          "https://rukminim2.flixcart.com/image/612/612/xif0q/top/s/q/w/xs-top-apple-new-coffee-dream-beauty-fashion-original-imah2gg3uesufvfx.jpeg?q=70",
          "https://rukminim2.flixcart.com/image/612/612/xif0q/top/v/x/h/xs-top-apple-new-coffee-dream-beauty-fashion-original-imah2gg38u3mgths.jpeg?q=70",
        ],
      },
    ],

    productDetails: [
      { label: "Brand", value: "VeBNoR" },
      { label: "Type", value: "Polo Neck" },
      { label: "Sleeve", value: "Half Sleeve" },
      { label: "Fit", value: "Regular" },
      { label: "Fabric", value: "Polyester" },
      { label: "Sales Package", value: "1 Tshirt" },
      { label: "Pack of", value: "1" },
      { label: "Neck Type", value: "Polo Neck" },
      { label: "Ideal For", value: "Men" },
      { label: "Size", value: "S" },
      { label: "Brand Color", value: "Mustard" },
      { label: "Occasion", value: "Casual" },
      { label: "Tee Length", value: "Medium" },
      {
        label: "Trend",
        value: "Sports, Solid pique Polo, Knits, Sports Chic, Solids",
      },
    ],
  },
  {
    id: 7, // unique product group id
    category: ["electronics", "Headphones"],
    brand: "TRIGGR",
    name: "TRIGGR Trinity 2 with Dual Pairing, ENC, Fast Charge, 50H Battery, Rubber Finish, v5.3 Bluetooth  (Cobalt Blue, On the Ear)",
    deliveryDays: 3,
    defaultVariant: {
      color: "Blue",
    },

    images: [
      "https://rukminim2.flixcart.com/image/612/612/xif0q/headphone/o/c/r/-original-imahafrfrqeyf2y9.jpeg?q=70",
    ],

    discount: "14%",
    originalPrice: 999,
    discountedPrice: 258,
    rating: 4.2, // average rating of all variants
    totalReviews: 45, // total verified reviews across all variants
    subcategory: ["Headphones"],

    variants: [
      {
        id: "7",
        color: "Blue",
        stockQuantity: 0,
        inStock: false,
        originalPrice: 999,
        discountedPrice: 258,
        discount: "14%",
        images: [
          "https://rukminim2.flixcart.com/image/612/612/xif0q/headphone/o/c/r/-original-imahafrfrqeyf2y9.jpeg?q=70",
        ],
      },
    ],

    productDetails: [
      { label: "Brand", value: "VeBNoR" },
      { label: "Type", value: "Polo Neck" },
      { label: "Sleeve", value: "Half Sleeve" },
      { label: "Fit", value: "Regular" },
      { label: "Fabric", value: "Polyester" },
      { label: "Sales Package", value: "1 Tshirt" },
      { label: "Pack of", value: "1" },
      { label: "Neck Type", value: "Polo Neck" },
      { label: "Ideal For", value: "Men" },
      { label: "Size", value: "S" },
      { label: "Brand Color", value: "Mustard" },
      { label: "Occasion", value: "Casual" },
      { label: "Tee Length", value: "Medium" },
      {
        label: "Trend",
        value: "Sports, Solid pique Polo, Knits, Sports Chic, Solids",
      },
    ],
  },
  {
    id: 8, // unique product group id
    category: ["electronics", "Headphones"],
    brand: "GOBOULT",
    name: "GOBOULT Z40 with Zen ENC Mic, 60H Battery Life, Low Latency Gaming, Made In India, 5.3 Bluetooth  (White, Grey, In the Ear)",
    deliveryDays: 3,
    defaultVariant: {
      color: "Grey",
    },

    images: [
      "https://rukminim2.flixcart.com/image/612/612/xif0q/headphone/d/a/c/-original-imahebzzqs5fspcv.jpeg?q=70",
      "https://rukminim2.flixcart.com/image/612/612/xif0q/headphone/d/k/k/-original-imahe5md2eugb5nh.jpeg?q=70",
    ],

    discount: "14%",
    originalPrice: 999,
    discountedPrice: 258,
    rating: 4.2, // average rating of all variants
    totalReviews: 45, // total verified reviews across all variants
    subcategory: ["Earbuds"],

    variants: [
      {
        id: "8",
        color: "Grey",
        stockQuantity: 0,
        inStock: false,
        originalPrice: 999,
        discountedPrice: 258,
        discount: "14%",
        images: [
          "https://rukminim2.flixcart.com/image/612/612/xif0q/headphone/d/a/c/-original-imahebzzqs5fspcv.jpeg?q=70",
          "https://rukminim2.flixcart.com/image/612/612/xif0q/headphone/d/k/k/-original-imahe5md2eugb5nh.jpeg?q=70",
        ],
      },
    ],

    productDetails: [
      { label: "Brand", value: "VeBNoR" },
      { label: "Type", value: "Polo Neck" },
      { label: "Sleeve", value: "Half Sleeve" },
      { label: "Fit", value: "Regular" },
      { label: "Fabric", value: "Polyester" },
      { label: "Sales Package", value: "1 Tshirt" },
      { label: "Pack of", value: "1" },
      { label: "Neck Type", value: "Polo Neck" },
      { label: "Ideal For", value: "Men" },
      { label: "Size", value: "S" },
      { label: "Brand Color", value: "Mustard" },
      { label: "Occasion", value: "Casual" },
      { label: "Tee Length", value: "Medium" },
      {
        label: "Trend",
        value: "Sports, Solid pique Polo, Knits, Sports Chic, Solids",
      },
    ],
  },
  {
    id: 9, // unique product group id
    category: ["bags"],
    brand: "Campus Sutra",
    name: "Men Comfort Cuban Collar Solid Polycotton Casual T-Shirt",
    sizeChartImage:
      "https://rukminim2.flixcart.com/image/612/612/xif0q/backpack/7/w/a/-original-imagh3w83m9tkv7y.jpeg?q=70",
    deliveryDays: 3,
    defaultVariant: {
      color: "Yellow",
    },

    images: [
      "https://rukminim2.flixcart.com/image/612/612/xif0q/backpack/7/w/a/-original-imagh3w83m9tkv7y.jpeg?q=70",
      "https://rukminim2.flixcart.com/image/612/612/xif0q/backpack/7/w/a/-original-imagh3w83m9tkv7y.jpeg?q=70",
    ],

    discount: "14%",
    originalPrice: 999,
    discountedPrice: 258,
    rating: 4.2, // average rating of all variants
    totalReviews: 45, // total verified reviews across all variants
    gender: "Men",
    subcategory: ["Handle Bags"],

    variants: [
      {
        id: "9",
        color: "Yellow",
        stockQuantity: 0,
        inStock: false,
        originalPrice: 999,
        discountedPrice: 258,
        discount: "14%",
        images: [
          "https://rukminim2.flixcart.com/image/612/612/xif0q/backpack/7/w/a/-original-imagh3w83m9tkv7y.jpeg?q=70",
          "https://rukminim2.flixcart.com/image/612/612/xif0q/backpack/7/w/a/-original-imagh3w83m9tkv7y.jpeg?q=70",
        ],
      },
    ],

    productDetails: [
      { label: "Brand", value: "VeBNoR" },
      { label: "Type", value: "Polo Neck" },
      { label: "Sleeve", value: "Half Sleeve" },
      { label: "Fit", value: "Regular" },
      { label: "Fabric", value: "Polyester" },
      { label: "Sales Package", value: "1 Tshirt" },
      { label: "Pack of", value: "1" },
      { label: "Neck Type", value: "Polo Neck" },
      { label: "Ideal For", value: "Men" },
      { label: "Size", value: "S" },
      { label: "Brand Color", value: "Mustard" },
      { label: "Occasion", value: "Casual" },
      { label: "Tee Length", value: "Medium" },
      {
        label: "Trend",
        value: "Sports, Solid pique Polo, Knits, Sports Chic, Solids",
      },
    ],
  },
  {
    id: 10, // unique product group id
    category: ["bags"],
    brand: "Campus Sutra",
    name: "Men Comfort Cuban Collar Solid Polycotton Casual T-Shirt",
    sizeChartImage:
      "https://rukminim2.flixcart.com/image/612/612/xif0q/backpack/7/w/a/-original-imagh3w83m9tkv7y.jpeg?q=70",
    deliveryDays: 3,
    defaultVariant: {
      color: "Yellow",
    },

    images: [
      "https://rukminim2.flixcart.com/image/612/612/xif0q/backpack/7/w/a/-original-imagh3w83m9tkv7y.jpeg?q=70",
      "https://rukminim2.flixcart.com/image/612/612/xif0q/backpack/7/w/a/-original-imagh3w83m9tkv7y.jpeg?q=70",
    ],

    discount: "14%",
    originalPrice: 999,
    discountedPrice: 258,
    rating: 4.2, // average rating of all variants
    totalReviews: 45, // total verified reviews across all variants
    gender: "Men",
    subcategory: ["Handle Bags"],

    variants: [
      {
        id: "10",
        color: "Yellow",
        stockQuantity: 0,
        inStock: false,
        originalPrice: 999,
        discountedPrice: 258,
        discount: "14%",
        images: [
          "https://rukminim2.flixcart.com/image/612/612/xif0q/backpack/7/w/a/-original-imagh3w83m9tkv7y.jpeg?q=70",
          "https://rukminim2.flixcart.com/image/612/612/xif0q/backpack/7/w/a/-original-imagh3w83m9tkv7y.jpeg?q=70",
        ],
      },
    ],

    productDetails: [
      { label: "Brand", value: "VeBNoR" },
      { label: "Type", value: "Polo Neck" },
      { label: "Sleeve", value: "Half Sleeve" },
      { label: "Fit", value: "Regular" },
      { label: "Fabric", value: "Polyester" },
      { label: "Sales Package", value: "1 Tshirt" },
      { label: "Pack of", value: "1" },
      { label: "Neck Type", value: "Polo Neck" },
      { label: "Ideal For", value: "Men" },
      { label: "Size", value: "S" },
      { label: "Brand Color", value: "Mustard" },
      { label: "Occasion", value: "Casual" },
      { label: "Tee Length", value: "Medium" },
      {
        label: "Trend",
        value: "Sports, Solid pique Polo, Knits, Sports Chic, Solids",
      },
    ],
  },
  {
    id: 11, // unique product group id
    category: ["Footwear"],
    brand: "asian",
    name: "Casual Sneakers Shoes For Men Mexico-11 Sneakers For Men  (Green , 10)",
    sizeChartImage:
      "https://i.etsystatic.com/27841497/r/il/d3487f/3784232713/il_fullxfull.3784232713_ac8w.jpg",
    deliveryDays: 3,
    defaultVariant: {
      color: "Green",
      sizes: [
        { size: "6", inStock: true, stockQuantity: 6 },
        { size: "7", inStock: true, stockQuantity: 9 },
        { size: "8", inStock: true, stockQuantity: 15 },
        { size: "9", inStock: false, stockQuantity: 0 },
        { size: "10", inStock: true, stockQuantity: 3 },
        { size: "11", inStock: false, stockQuantity: 0 },
      ],
    },

    images: [
      "https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/p/l/n/6-mexico-11-6-asian-green-original-imah3nxzfcgrn75k.jpeg?q=70",
    ],

    discount: "14%",
    originalPrice: 999,
    discountedPrice: 258,
    rating: 4.2, // average rating of all variants
    totalReviews: 45, // total verified reviews across all variants
    gender: "Men",
    subcategory: ["Sneakers"],

    variants: [
      {
        id: "11",
        color: "Green",
        sizes: [
          { size: "6", inStock: true, stockQuantity: 6 },
          { size: "7", inStock: true, stockQuantity: 9 },
          { size: "8", inStock: true, stockQuantity: 15 },
          { size: "9", inStock: false, stockQuantity: 0 },
          { size: "10", inStock: true, stockQuantity: 3 },
          { size: "11", inStock: false, stockQuantity: 0 },
        ],
        stockQuantity: 0,
        inStock: false,
        originalPrice: 999,
        discountedPrice: 258,
        discount: "14%",
        images: [
          "https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/p/l/n/6-mexico-11-6-asian-green-original-imah3nxzfcgrn75k.jpeg?q=70",
        ],
      },
    ],

    productDetails: [
      { label: "Brand", value: "VeBNoR" },
      { label: "Type", value: "Polo Neck" },
      { label: "Sleeve", value: "Half Sleeve" },
      { label: "Fit", value: "Regular" },
      { label: "Fabric", value: "Polyester" },
      { label: "Sales Package", value: "1 Tshirt" },
      { label: "Pack of", value: "1" },
      { label: "Neck Type", value: "Polo Neck" },
      { label: "Ideal For", value: "Men" },
      { label: "Size", value: "S" },
      { label: "Brand Color", value: "Mustard" },
      { label: "Occasion", value: "Casual" },
      { label: "Tee Length", value: "Medium" },
      {
        label: "Trend",
        value: "Sports, Solid pique Polo, Knits, Sports Chic, Solids",
      },
    ],
  },
];
