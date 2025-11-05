"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  username: string;
  email?: string;
  name?: string;
  picture?: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, roles?: string[], email?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (idToken: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string, confirmPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL && typeof window !== 'undefined') {
  console.error('NEXT_PUBLIC_API_BASE_URL is not set in environment variables');
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const url = `${API_BASE_URL}/auth/login`.replace(/([^:]\/)\/+/g, "$1");
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        // Try to get error message for better feedback
        try {
          const errorData = await response.json();
          console.error('Login error:', errorData.message || 'Login failed');
        } catch {
          // Ignore if response is not JSON
        }
        return false;
      }

      const data = await response.json();
      
      // Check for token in data.data.token (based on Postman collection response structure)
      const token = data.data?.token || data.token;
      const userData = data.data || data.user || data;
      
      if (token) {
        setToken(token);
        setUser({
          id: String(userData.id || data.id || ''),
          username: userData.username || username,
          email: userData.email,
          roles: userData.roles || data.roles || ['ROLE_USER'],
        });
        
        // Store in localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify({
          id: String(userData.id || data.id || ''),
          username: userData.username || username,
          email: userData.email,
          roles: userData.roles || data.roles || ['ROLE_USER'],
        }));
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (username: string, password: string, roles: string[] = ['ROLE_USER'], email?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const url = `${API_BASE_URL}/auth/register`.replace(/([^:]\/)\/+/g, "$1");
      
      const requestBody: any = { username, password, roles };
      if (email) {
        requestBody.email = email;
      }
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        
        // Handle validation errors that return multiple field-specific errors
        if (errorData.message) {
          return { success: false, error: errorData.message };
        }
        
        // Handle field-specific validation errors
        const errorMessages = Object.entries(errorData)
          .filter(([key]) => key !== 'message' && key !== 'stackTrace')
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
        
        if (errorMessages) {
          return { success: false, error: errorMessages };
        }
        
        return { success: false, error: 'Registration failed' };
      }

      const data = await response.json();
      
      // Check for token in data.data.token (based on Postman collection response structure)
      const token = data.data?.token || data.token;
      const userData = data.data || data.user || data;
      
      if (token) {
        // If token is returned, use it directly
        setToken(token);
        setUser({
          id: String(userData.id || data.id || ''),
          username: userData.username || username,
          email: userData.email || email,
          roles: userData.roles || roles,
        });
        
        // Store in localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify({
          id: String(userData.id || data.id || ''),
          username: userData.username || username,
          email: userData.email || email,
          roles: userData.roles || roles,
        }));
        
        return { success: true };
      }
      
      // If no token is returned, auto-login the user
      if (userData.id || data.id) {
        const loginSuccess = await login(username, password);
        if (loginSuccess) {
          return { success: true };
        }
        return { success: false, error: 'Registration successful, but automatic login failed. Please login manually.' };
      }
      
      return { success: false, error: 'Registration failed: No user data received' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Network error' };
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string, confirmPassword: string): Promise<boolean> => {
    try {
      const url = `${API_BASE_URL}/user/change_password`.replace(/([^:]\/)\/+/g, "$1");
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword, confirmNewPassword: confirmPassword }),
      });

      return response.ok;
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    }
  };

  const loginWithGoogle = async (idToken: string): Promise<boolean> => {
    try {
      // Send raw ID token to backend
      const url = `${API_BASE_URL}/auth/login/google`.replace(/([^:]\/)\/+/g, "$1");
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      console.log('Backend response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Backend error:', errorData);
        return false;
      }

      const backendData = await response.json();
      console.log('Backend data:', backendData);
      
      // Extract token and user data from response
      if (backendData.data && backendData.data.token) {
        const token = backendData.data.token;
        const userData = backendData.data;
        
        const user: User = {
          id: String(userData.id || ''),
          username: userData.username || '',
          email: userData.email,
          name: userData.name,
          picture: userData.profilePictureUrl,
          roles: userData.roles || ['ROLE_USER'],
        };
        
        setToken(token);
        setUser(user);
        
        // Store in localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    loginWithGoogle,
    logout,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
