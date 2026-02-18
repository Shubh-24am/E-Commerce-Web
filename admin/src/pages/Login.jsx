import { useContext, useState } from 'react';
import logo from '../assets/logo.png';
import { IoEyeOutline, IoEye } from "react-icons/io5";
import axios from 'axios';
import { AuthDataContext } from '../context/AuthContext';
import { AdminDataContext } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { serverUrl } = useContext(AuthDataContext);
  const { getAdmin } = useContext(AdminDataContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const AdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/adminlogin`,
        { email, password },
        { withCredentials: true }
      );
      toast.success("Admin login successful");
      getAdmin();
      navigate("/");
    } catch (error) {
      toast.error("Admin login failed");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-white flex flex-col items-center">
      {/* Header */}
      <div className="w-full h-[80px] flex items-center px-[30px] gap-[10px] cursor-pointer">
        <img className="w-[40px]" src={logo} alt="OneCart Logo" />
        <h1 className="text-[22px] font-sans">OneCart</h1>
      </div>

      {/* Title */}
      <div className="w-full h-[100px] flex flex-col items-center gap-[10px]">
        <span className="text-[25px] font-semibold">Login Page</span>
        <span className="text-[16px]">Welcome to OneCart, Admin Login</span>
      </div>

      {/* Login Form */}
      <div className="max-w-[600px] w-[90%] h-[400px] bg-[#00000025] border border-[#96969635] rounded-lg shadow-lg flex items-center justify-center">
        <form onSubmit={AdminLogin} className="w-[90%] h-[90%] flex flex-col gap-[20px]">
          <div className="w-full flex flex-col gap-[15px] relative">
            <input
              type="email"
              className="w-full h-[50px] border border-[#96969635] rounded-lg shadow-lg bg-transparent placeholder-[#ffffffc7] px-[20px] font-semibold"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <input
              type={show ? "text" : "password"}
              className="w-full h-[50px] border border-[#96969635] rounded-lg shadow-lg bg-transparent placeholder-[#ffffffc7] px-[20px] font-semibold"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            {show ? (
              <IoEye
                className="w-[20px] h-[20px] cursor-pointer absolute right-[5%] bottom-[50%]"
                onClick={() => setShow(false)}
                aria-label="Hide password"
              />
            ) : (
              <IoEyeOutline
                className="w-[20px] h-[20px] cursor-pointer absolute right-[5%] bottom-[50%]"
                onClick={() => setShow(true)}
                aria-label="Show password"
              />
            )}
            <button
              type="submit"
              className="w-full h-[50px] bg-[#6060f5] rounded-lg flex items-center justify-center mt-[20px] text-[17px] font-semibold"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;