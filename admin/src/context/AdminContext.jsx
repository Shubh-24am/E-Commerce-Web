import { createContext, useContext, useEffect, useState } from 'react';
import { AuthDataContext } from './AuthContext';
import axios from 'axios';

export const AdminDataContext = createContext();

function AdminContext({ children }) {
  const [adminData, setAdminData] = useState(null);
  const { serverUrl } = useContext(AuthDataContext);

  const getAdmin = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/user/getadmin", { withCredentials: true });
      setAdminData(result.data);
    } catch (error) {
      setAdminData(null);
      // Optional: replace console.log with toast or error tracking
      console.error("Failed to fetch admin data:", error);
    }
  };

  useEffect(() => {
    getAdmin();
  }, []);

  const value = {
    adminData,
    setAdminData,
    getAdmin,
  };

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
}

export default AdminContext;