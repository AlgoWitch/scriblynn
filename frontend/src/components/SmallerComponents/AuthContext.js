// src/components/SmallerComponents/AuthContext.js
import { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => {
    signOut(auth)
      .then(() => {
        setIsLoggedIn(false);
        setCurrentUser(null);
      })
      .catch((error) => console.error("Logout error:", error));
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, currentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
