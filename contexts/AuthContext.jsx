import { createContext, useState, useEffect } from 'react';
import { supabase, signIn, signUp, signOut } from '../lib/supabase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on page load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Supabase ile mevcut oturumu kontrol et
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to check auth status:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Oturum değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    checkAuthStatus();

    // Cleanup
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (credentials) => {
    try {
      const { email, password } = credentials;
      const data = await signIn({ email, password });
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const data = await signUp(userData);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};