import React, { useState, useEffect } from "react";
import AccountDetailsSection from "./AccountDetailsSection";
import { Link, useNavigate } from "react-router-dom";
import ContactUsPart from "./ContactUsPart";

const sampleOrders = [
  {
    orderId: "6887b583228db479bba3d66a",
    paymentId: "PAY987654",
    name: "John Doe",
    phone: "9876543210",
    address:
      "APJ Abdul Kalam Hall Of Residency, CET college, Ghatikia, Bhubaneswar, Odisha - 751029 Bhubaneswar hi Odisha India",
    pincode: "110001",
    totalAmount: 499.99,
    email: "amishra59137@gmail.com",
    status: "Delivered",
    date: "2024-07-01",
    userId: "USR001",
  },
  {
    orderId: "ORD123457",
    paymentId: "PAY987655",
    name: "Ayush Kumar Mishra",
    phone: "9876500000",
    address: "456 Avenue, Another City",
    pincode: "220002",
    totalAmount: 849.5,
    email: "amishra59137@gmail.com",
    status: "Shipped",
    date: "2024-07-15",
    userId: "USR002",
  },
  {
    orderId: "ORD123457",
    paymentId: "PAY987655",
    name: "Ayush Kumar Mishra",
    phone: "9876500000",
    address: "456 Avenue, Another City",
    pincode: "220002",
    totalAmount: 849.5,
    email: "amishra59137@gmail.com",
    status: "Shipped",
    date: "2024-07-15",
    userId: "USR002",
  },
  {
    orderId: "ORD123457",
    paymentId: "PAY987655",
    name: "Ayush Kumar Mishra",
    phone: "9876500000",
    address: "456 Avenue, Another City",
    pincode: "220002",
    totalAmount: 849.5,
    email: "amishra59137@gmail.com",
    status: "Shipped",
    date: "2024-07-15",
    userId: "USR002",
  },
  {
    orderId: "ORD123457",
    paymentId: "PAY987655",
    name: "Ayush Kumar Mishra",
    phone: "9876500000",
    address: "456 Avenue, Another City",
    pincode: "220002",
    totalAmount: 849.5,
    email: "amishra59137@gmail.com",
    status: "Shipped",
    date: "2024-07-15",
    userId: "USR002",
  },
  {
    orderId: "ORD123457",
    paymentId: "PAY987655",
    name: "Ayush Kumar Mishra",
    phone: "9876500000",
    address: "456 Avenue, Another City",
    pincode: "220002",
    totalAmount: 849.5,
    email: "amishra59137@gmail.com",
    status: "Shipped",
    date: "2024-07-15",
    userId: "USR002",
  },
  {
    orderId: "ORD123457",
    paymentId: "PAY987655",
    name: "Ayush Kumar Mishra",
    phone: "9876500000",
    address: "456 Avenue, Another City",
    pincode: "220002",
    totalAmount: 849.5,
    email: "amishra59137@gmail.com",
    status: "Shipped",
    date: "2024-07-15",
    userId: "USR002",
  },
  {
    orderId: "ORD123457",
    paymentId: "PAY987655",
    name: "Ayush Kumar Mishra",
    phone: "9876500000",
    address: "456 Avenue, Another City",
    pincode: "220002",
    totalAmount: 849.5,
    email: "amishra59137@gmail.com",
    status: "Shipped",
    date: "2024-07-15",
    userId: "USR002",
  },
  {
    orderId: "ORD123457",
    paymentId: "PAY987655",
    name: "Ayush Kumar Mishra",
    phone: "9876500000",
    address: "456 Avenue, Another City",
    pincode: "220002",
    totalAmount: 849.5,
    email: "amishra59137@gmail.com",
    status: "Shipped",
    date: "2024-07-15",
    userId: "USR002",
  },
  {
    orderId: "ORD123457",
    paymentId: "PAY987655",
    name: "Ayush Kumar Mishra",
    phone: "9876500000",
    address: "456 Avenue, Another City",
    pincode: "220002",
    totalAmount: 849.5,
    email: "amishra59137@gmail.com",
    status: "Processing",
    date: "2024-07-15",
    userId: "USR002",
  },
];

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setOrders(sampleOrders);
    }, 500);
  }, []);

  return (
    <div>
        <section className="page-layout flex gap-10 ml-10 mt-2 max-w-[1190px] mx-auto mb-8">
      {/* Sidebar with Account Details */}
      <div className="sidebar flex-shrink-0 min-w-[20%] w-auto sticky top-28 self-start">
        <AccountDetailsSection />
      </div>

      <div className="w-[80%]">
        {/* Main Content: Orders List */}
        <div className="mt-5 bg-white rounded-lg shadow-md border border-gray-200">
          <div className="py-5 px-4">
            <h1 className="text-2xl font-semibold mb-2">My Orders</h1>
            <p className=" text-lg text-gray-600">
              There are{" "}
              <span className="text-red-500 font-semibold">
                {orders.length}
              </span>{" "}
              orders
            </p>

            <div className="relative overflow-x-auto">
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[280px]">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3500/3500833.png"
                    alt="No Orders"
                    className="w-28 h-28 opacity-40 mb-4"
                  />
                  <p className="text-gray-500 text-lg mb-2">
                    You have no orders yet.
                  </p>
                  <Link
                    to="/"
                    className="text-white bg-red-500 px-6 py-2 rounded-lg font-semibold hover:bg-red-600 mt-3"
                  >
                    Shop Now
                  </Link>
                </div>
              ) : (
                <div>
                  <div className="mt-4 rounded-md border border-gray-300 shadow-md min-w-max w-full">
                    {/* Header with fixed width columns */}
                    <div className="bg-gray-800 text-white uppercase text-sm font-semibold grid grid-cols-[220px_130px_200px_130px_490px_100px_140px_280px_100px_140px_150px_110px] text-center whitespace-nowrap">
                      <div className="py-3 px-4">Order ID</div>
                      <div className="py-3 px-4">Payment ID</div>
                      <div className="py-3 px-4">Name</div>
                      <div className="py-3 px-4">Phone Number</div>
                      <div className="py-3 px-4 ">Address</div>
                      <div className="py-3 px-4">Pincode</div>
                      <div className="py-3 px-4">Total Amount</div>
                      <div className="py-3 px-4 ">Email</div>
                      <div className="py-3 px-4">User ID</div>
                      <div className="py-3 px-4">Order Status</div>
                      <div className="py-3 px-4">Payment Mode</div>
                      <div className="py-3 px-4">Date</div>
                    </div>

                    {/* Rows with exact same fixed widths and truncate for overflow */}
                    {orders.map((order, index) => (
                      <div
                        key={index}
                        onClick={() =>
                          navigate(`/account/orders/${order.orderId}`)
                        }
                        className="grid grid-cols-[220px_130px_200px_130px_490px_100px_140px_280px_100px_140px_150px_110px] text-sm border-b border-gray-300 text-center whitespace-nowrap hover:bg-gray-50 cursor-pointer"
                        title={`Order ${order.orderId}`}
                      >
                        <div className="py-3 px-4 text-red-500 whitespace-nowrap">
                          {order.orderId}
                        </div>
                        <div className="py-3 px-4">{order.paymentId}</div>
                        <div className="py-3 px-4 truncate">{order.name}</div>
                        <div className="py-3 px-4">{order.phone}</div>
                        <div
                          className="py-3 px-4"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "480px",
                            whiteSpace: "normal",
                          }}
                        >
                          {order.address}
                        </div>
                        <div className="py-3 px-4">{order.pincode}</div>
                        <div className="py-3 px-4">
                          ₹
                          {order.totalAmount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                        <div className="py-3 px-4 truncate">{order.email}</div>
                        <div className="py-3 px-4">{order.userId}</div>
                        <div
                          className={`py-3 px-4 font-semibold ${
                            order.status === "Delivered"
                              ? "text-green-600"
                              : order.status === "Shipped"
                              ? "text-blue-600"
                              : order.status === "Processing"
                              ? "text-yellow-600"
                              : "text-gray-700"
                          }`}
                        >
                          {order.status}
                        </div>
                        <div className="py-3 px-4 text-green-700 font-semibold">
                          Cash On Delivery
                        </div>
                        <div className="py-3 px-4">
                          {new Date(order.date).toLocaleDateString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
    <ContactUsPart/>
    </div>
  );
};

export default MyOrders;
