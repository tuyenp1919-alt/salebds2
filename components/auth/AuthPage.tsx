import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { useAuth } from '../../contexts/AuthContext';

export const AuthPage: React.FC = () => {
  const [currentForm, setCurrentForm] = useState<'login' | 'register'>('login');
  const { user } = useAuth();

  // If user is already logged in, don't show auth forms
  if (user) {
    return null;
  }

  const handleLoginSuccess = () => {
    // The app will automatically redirect to main content when user state changes
    console.log('Login successful');
  };

  const handleRegisterSuccess = () => {
    // The app will automatically redirect to main content when user state changes
    console.log('Registration successful');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo and App Name */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sale AI Pro</h1>
          <p className="text-gray-600">Hệ thống CRM bất động sản thông minh</p>
        </div>

        {/* Authentication Forms */}
        {currentForm === 'login' ? (
          <LoginForm
            onSwitchToRegister={() => setCurrentForm('register')}
            onLoginSuccess={handleLoginSuccess}
          />
        ) : (
          <RegisterForm
            onSwitchToLogin={() => setCurrentForm('login')}
            onRegisterSuccess={handleRegisterSuccess}
          />
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>&copy; 2024 Sale AI Pro. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </div>
  );
};