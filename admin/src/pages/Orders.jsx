import { useContext, useState, useEffect } from 'react';
import Nav from '../component/Nav';
import Sidebar from '../component/Sidebar';
import { AuthDataContext } from '../context/AuthContext';
import axios from 'axios';
import { SiEbox } from "react-icons/si";

function Orders() {
  const [orders, setOrders] = useState([]);
  const { serverUrl } = useContext(AuthDataContext);

  const fetchAllOrders = async () => {
    try {
      const result = await axios.post(`${serverUrl}/api/order/list`, {}, { withCredentials: true });
      setOrders(result.data.reverse());
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const statusHandler = async (e, orderId) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/status`,
        { orderId, status: e.target.value },
        { withCredentials: true }
      );
      if (result.data) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="w-[99vw] min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-white">
      <Nav />
      <div className="w-full h-full flex items-center lg:justify-start justify-center">
        <Sidebar />
        <div className="lg:w-[85%] md:w-[70%] h-full lg:ml-[310px] md:ml-[250px] mt-[70px] flex flex-col gap-[30px] overflow-x-hidden py-[50px] ml-[100px]">
          <div className="w-[400px] h-[50px] text-[28px] md:text-[40px] mb-[20px]">All Orders List</div>
          {orders.map((order) => (
            <div
              key={order._id}
              className="w-[90%] bg-slate-600 rounded-xl flex lg:items-center items-start justify-between flex-col lg:flex-row p-[10px] md:px-[20px] gap-[20px]"
            >
              <SiEbox className="w-[60px] h-[60px] text-black p-[5px] rounded-lg bg-white" aria-hidden="true" />

              <div>
                <div className="flex flex-col gap-[5px] text-[16px] text-[#56dbfc]">
                  {order.items.map((item, idx) => (
                    <p key={item._id || idx}>
                      {item.name.toUpperCase()} * {item.quantity} <span>{item.size}</span>
                      {idx !== order.items.length - 1 && ","}
                    </p>
                  ))}
                </div>

                <div className="text-[15px] text-green-100">
                  <p>{`${order.address.firstName} ${order.address.lastName}`}</p>
                  <p>{order.address.street}</p>
                  <p>{`${order.address.city}, ${order.address.state}, ${order.address.country}, ${order.address.pinCode}`}</p>
                  <p>{order.address.phone}</p>
                </div>
              </div>

              <div className="text-[15px] text-green-100">
                <p>Items: {order.items.length}</p>
                <p>Method: {order.paymentMethod}</p>
                <p>Payment: {order.payment ? 'Done' : 'Pending'}</p>
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                <p className="text-[20px] text-white">₹ {order.amount}</p>
              </div>

              <label className="sr-only" htmlFor={`status-${order._id}`}>Order Status</label>
              <select
                id={`status-${order._id}`}
                value={order.status}
                className="px-[5px] py-[10px] bg-slate-500 rounded-lg border border-[#96eef3]"
                onChange={(e) => statusHandler(e, order._id)}
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Orders;