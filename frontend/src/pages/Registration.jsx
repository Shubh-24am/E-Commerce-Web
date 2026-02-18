// Registration.jsx
import React, { useState, useContext } from 'react';
import Logo from "../assets/logo.png";
import { useNavigate } from 'react-router-dom';
import google from '../assets/google.png';
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utils/Firebase';
import { userDataContext } from '../context/UserContext';
import { toast } from 'react-toastify';
import Loading from '../component/Loading';

function Registration() {
  const [show, setShow] = useState(false);
  const { serverUrl } = useContext(authDataContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { getCurrentUser } = useContext(userDataContext);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handle signup with email/password
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + '/api/auth/registration',
        { name, email, password },
        {
        withCredentials: true,              
        headers: { "Content-Type": "application/json" }
      }

      );
      getCurrentUser();
      navigate("/");
      toast.success("User Registration Successful");
      console.log(result.data);
    } catch (error) {
      console.log(error);
      toast.error("User Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle signup with Google
  const googleSignup = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      const name = user.displayName;
      const email = user.email;

      const result = await axios.post(
        serverUrl + "/api/auth/googlelogin",
        { name, email },
        { withCredentials: true }
      );
      console.log(result.data);
      getCurrentUser();
      navigate("/");
      toast.success("User Registration Successful");
    } catch (error) {
      console.log(error);
      toast.error("User Registration Failed");
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-white flex flex-col items-center justify-start">
      
      {/* Logo Header */}
      <div
        className="w-[100%] h-[80px] flex items-center justify-start px-[30px] gap-[10px] cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img className="w-[40px]" src={Logo} alt="OneCart Logo" />
        <h1 className="text-[22px] font-sans">OneCart</h1>
      </div>

      {/* Page Title */}
      <div className="w-[100%] h-[100px] flex items-center justify-center flex-col gap-[10px]">
        <span className="text-[25px] font-semibold">Registration Page</span>
        <span className="text-[16px]">Welcome to OneCart, Place your order</span>
      </div>

      {/* Registration Form */}
      <div className="max-w-[600px] w-[90%] h-[500px] bg-[#00000025] border border-[#96969635] backdrop:blur-2xl rounded-lg shadow-lg flex items-center justify-center">
        <form onSubmit={handleSignup} className="w-[90%] h-[90%] flex flex-col items-center justify-start gap-[20px]">
          
          {/* Google Signup */}
          <div
            className="w-[90%] h-[50px] bg-[#42656cae] rounded-lg flex items-center justify-center gap-[10px] py-[20px] cursor-pointer"
            onClick={googleSignup}
          >
            <img src={google} alt="Google Logo" className="w-[20px]" /> Registration with Google
          </div>

          {/* Divider */}
          <div className="w-[100%] h-[20px] flex items-center justify-center gap-[10px]">
            <div className="w-[40%] h-[1px] bg-[#96969635]"></div> OR <div className="w-[40%] h-[1px] bg-[#96969635]"></div>
          </div>

          {/* Input Fields */}
          <div className="w-[90%] h-[400px] flex flex-col items-center justify-center gap-[15px] relative">
            <input
              type="text"
              className="w-[100%] h-[50px] border-2 border-[#96969635] backdrop:blur-sm rounded-lg shadow-lg bg-transparent placeholder-[#ffffffc7] px-[20px] font-semibold"
              placeholder="UserName"
              required
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <input
              type="text"
              className="w-[100%] h-[50px] border-2 border-[#96969635] backdrop:blur-sm rounded-lg shadow-lg bg-transparent placeholder-[#ffffffc7] px-[20px] font-semibold"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <input
              type={show ? "text" : "password"}
              className="w-[100%] h-[50px] border-2 border-[#96969635] backdrop:blur-sm rounded-lg shadow-lg bg-transparent placeholder-[#ffffffc7] px-[20px] font-semibold"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            {!show && (
              <IoEyeOutline
                className="w-[20px] h-[20px] cursor-pointer absolute right-[5%]"
                onClick={() => setShow((prev) => !prev)}
              />
            )}
            {show && (
              <IoEye
                className="w-[20px] h-[20px] cursor-pointer absolute right-[5%]"
                onClick={() => setShow((prev) => !prev)}
              />
            )}

            {/* Submit Button */}
            <button className="w-[100%] h-[50px] bg-[#6060f5] rounded-lg flex items-center justify-center mt-[20px] text-[17px] font-semibold">
              {loading ? <Loading /> : "Create Account"}
            </button>

            {/* Redirect to Login */}
            <p className="flex gap-[10px]">
              Already have an account?{" "}
              <span
                className="text-[#5555f6cf] text-[17px] font-semibold cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registration;