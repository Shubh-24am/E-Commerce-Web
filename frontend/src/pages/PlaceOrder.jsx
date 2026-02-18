// PlaceOrder.jsx
import React, { useContext, useState } from 'react';
import Title from '../component/Title';
import CartTotal from '../component/CartTotal';
import razorpay from '../assets/Razorpay.jpg';
import { shopDataContext } from '../context/ShopContext';
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../component/Loading';

function PlaceOrder() {
  const [method, setMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '',
    street: '', city: '', state: '',
    pinCode: '', country: '', phone: ''
  });

  const navigate = useNavigate();
  const { cartItem, setCartItem, getCartAmount, delivery_fee, products } = useContext(shopDataContext);
  const { serverUrl } = useContext(authDataContext);

  // Handle input changes
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData(data => ({ ...data, [name]: value }));
  };

  // Razorpay payment init
  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(serverUrl + '/api/order/verifyrazorpay', response, { withCredentials: true });
          if (data) {
            navigate("/order");
            setCartItem({});
          }
        } catch (error) {
          console.log(error);
          toast.error("Payment verification failed");
        }
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Submit handler
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let orderItems = [];
      for (const items in cartItem) {
        for (const item in cartItem[items]) {
          if (cartItem[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItem[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      };

      switch (method) {
        case 'cod': {
          const result = await axios.post(serverUrl + "/api/order/placeorder", orderData, { withCredentials: true });
          if (result.data) {
            setCartItem({});
            toast.success("Order Placed");
            navigate("/order");
          } else {
            toast.error("Order Placement Error");
          }
          break;
        }
        case 'razorpay': {
          const resultRazorpay = await axios.post(serverUrl + "/api/order/razorpay", orderData, { withCredentials: true });
          if (resultRazorpay.data) {
            initPay(resultRazorpay.data);
            toast.success("Order Initiated");
          }
          break;
        }
        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error("Order submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] flex items-center justify-center flex-col md:flex-row gap-[50px] relative">
      
      {/* Delivery Information Form */}
      <div className="lg:w-[50%] w-[100%] h-[100%] flex items-center justify-center mt-[90px] lg:mt-0">
        <form onSubmit={onSubmitHandler} className="lg:w-[70%] w-[95%] lg:h-[70%] h-[100%]">
          <div className="py-[10px]">
            <Title text1={'DELIVERY'} text2={'INFORMATION'} />
          </div>

          {/* Input Fields */}
          {/* ... keep your existing input fields unchanged ... */}

          {/* Submit Button */}
          <div>
            <button type="submit"
              className="text-[18px] active:bg-slate-500 cursor-pointer bg-[#3bcee848] py-[10px] px-[50px] rounded-2xl text-white flex items-center justify-center gap-[20px] absolute lg:right-[20%] bottom-[10%] right-[35%] border-[1px] border-[#80808049] ml-[30px] mt-[20px]">
              {loading ? <Loading /> : "PLACE ORDER"}
            </button>
          </div>
        </form>
      </div>

      {/* Payment Section */}
      <div className="lg:w-[50%] w-[100%] min-h-[100%] flex items-center justify-center gap-[30px]">
        <div className="lg:w-[70%] w-[90%] lg:h-[70%] h-[100%] flex items-center justify-center gap-[10px] flex-col">
          <CartTotal />
          <div className="py-[10px]">
            <Title text1={'PAYMENT'} text2={'METHOD'} />
          </div>
          <div className="w-[100%] h-[30vh] lg:h-[100px] flex items-start mt-[20px] lg:mt-[0px] justify-center gap-[50px]">
            <button onClick={() => setMethod('razorpay')}
              className={`w-[150px] h-[50px] rounded-sm ${method === 'razorpay' ? 'border-[5px] border-blue-900 rounded-sm' : ''}`}>
              <img src={razorpay} alt="Razorpay Payment Option" className="w-[100%] h-[100%] object-fill rounded-sm" />
            </button>
            <button onClick={() => setMethod('cod')}
              className={`w-[200px] h-[50px] bg-gradient-to-t from-[#95b3f8] to-[white] text-[14px] px-[20px] rounded-sm text-[#332f6f] font-bold ${method === 'cod' ? 'border-[5px] border-blue-900 rounded-sm' : ''}`}>
              CASH ON DELIVERY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;