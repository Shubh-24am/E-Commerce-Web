import { createContext } from 'react';

export const AuthDataContext = createContext(null);

function AuthContext({ children }) {
  const serverUrl = "https://e-commerce-web-backend-q8ej.onrender.com";

  const value = {
    serverUrl,
  };

  return (
    <AuthDataContext.Provider value={value}>
      {children}
    </AuthDataContext.Provider>
  );
}

export default AuthContext;
