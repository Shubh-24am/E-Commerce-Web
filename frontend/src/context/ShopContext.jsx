// ShopContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authDataContext } from './AuthContext';
import { userDataContext } from './UserContext';
import axios from 'axios';
import { toast } from 'react-toastify';

export const shopDataContext = createContext();

function ShopContext({ children }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItem, setCartItem] = useState({});
  const [loading, setLoading] = useState(false);

  const { userData } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);

  const currency = '₹';
  const delivery_fee = 40;

  // Fetch products
  const getProducts = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/product/list");
      setProducts(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Add product to cart
  const addtoCart = async (itemId, size) => {
    if (!size) {
      console.log("Select Product Size");
      return;
    }

    let cartData = structuredClone(cartItem);

    if (cartData[itemId]) {
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    } else {
      cartData[itemId] = { [size]: 1 };
    }

    setCartItem(cartData);

    if (userData) {
      setLoading(true);
      try {
        await axios.post(serverUrl + "/api/cart/add", { itemId, size }, { withCredentials: true });
        toast.success("Product Added");
      } catch (error) {
        console.log(error);
        toast.error("Add Cart Error");
      } finally {
        setLoading(false);
      }
    }
  };

  // Get user cart
  const getUserCart = async () => {
    try {
      const result = await axios.post(serverUrl + '/api/cart/get', {}, { withCredentials: true });
      setCartItem(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Update cart quantity
  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItem);
    cartData[itemId][size] = quantity;
    setCartItem(cartData);

    if (userData) {
      try {
        await axios.post(serverUrl + "/api/cart/update", { itemId, size, quantity }, { withCredentials: true });
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Get total cart count
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItem) {
      for (const item in cartItem[items]) {
        try {
          if (cartItem[items][item] > 0) {
            totalCount += cartItem[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalCount;
  };

  // Get total cart amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItem) {
      const itemInfo = products.find((product) => product._id === items);
      for (const item in cartItem[items]) {
        try {
          if (cartItem[items][item] > 0) {
            totalAmount += itemInfo.price * cartItem[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalAmount;
  };

  // Fetch products on mount
  useEffect(() => {
    getProducts();
  }, []);

  // Fetch user cart on mount
  useEffect(() => {
    getUserCart();
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    getProducts,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItem,
    addtoCart,
    getCartCount,
    setCartItem,
    updateQuantity,
    getCartAmount,
    loading,
  };

  return (
    <shopDataContext.Provider value={value}>
      {children}
    </shopDataContext.Provider>
  );
}

export default ShopContext;