// App.jsx
import React, { useContext } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Registration from './pages/Registration';
import Home from './pages/Home';
import Login from './pages/Login';
import Nav from './component/Nav';
import { userDataContext } from './context/UserContext';
import About from './pages/About';
import Collections from './pages/Collections';
import Product from './pages/Product';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import PlaceOrder from './pages/PlaceOrder';
import Order from './pages/Order';
import { ToastContainer } from 'react-toastify';
import NotFound from './pages/NotFound';
import Ai from './component/AI';

function ProtectedRoute({ children }) {
  const { userData } = useContext(userDataContext);
  const location = useLocation();

  if (!userData) {
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }
  return children;
}

function App() {
  const { userData } = useContext(userDataContext);
  const location = useLocation();

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      {userData && <Nav />}
      <Routes>
        {/* Auth Routes */}
        <Route
          path="/login"
          element={userData ? <Navigate to={location.state?.from || "/"} /> : <Login />}
        />
        <Route
          path="/signup"
          element={userData ? <Navigate to={location.state?.from || "/"} /> : <Registration />}
        />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
        <Route path="/collection" element={<ProtectedRoute><Collections /></ProtectedRoute>} />
        <Route path="/product" element={<ProtectedRoute><Product /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
        <Route path="/productdetail/:productId" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/placeorder" element={<ProtectedRoute><PlaceOrder /></ProtectedRoute>} />
        <Route path="/order" element={<ProtectedRoute><Order /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Ai />
    </>
  );
}

export default App;