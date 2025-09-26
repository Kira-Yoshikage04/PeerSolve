import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ALLOWED_DOMAIN } from '../constants';
import Logo from '../components/Logo';

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
    <path fill="#4285F4" d="M24 9.5c3.23 0 5.45.98 7.01 2.44l5.59-5.59C33.39 3.06 29.23 2 24 2 14.51 2 6.84 7.63 4.25 15.89l6.54 5.05C12.33 13.93 17.69 9.5 24 9.5z"></path>
    <path fill="#34A853" d="M46.25 24.5c0-1.63-.14-3.2-.4-4.7H24v8.99h12.48c-.53 2.89-2.19 5.34-4.64 6.99l6.23 4.85C42.84 36.46 46.25 31.06 46.25 24.5z"></path>
    <path fill="#FBBC05" d="M10.79 28.94c-.4-.95-.62-2.01-.62-3.11s.22-2.16.62-3.11L4.25 17.65C2.85 20.22 2 23.3 2 26.5s.85 6.28 2.25 8.85l6.54-5.06z"></path>
    <path fill="#EA4335" d="M24 47c5.23 0 9.39-1.73 12.52-4.66l-6.23-4.85c-1.74 1.17-3.96 1.88-6.29 1.88-6.31 0-11.67-4.43-13.21-10.42L4.25 34.11C6.84 42.37 14.51 47 24 47z"></path>
    <path fill="none" d="M0 0h48v48H0z"></path>
  </svg>
);

const LoginPage = () => {
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-sm p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl text-center animate-fade-in-up">
        <div className="flex flex-col items-center">
           <Logo className="h-20 w-auto mb-4" />
           <p className="mt-2 text-gray-600 dark:text-gray-400">Your Peer-to-Peer Doubt Solving Network</p>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-300 border-t border-b border-gray-200 dark:border-gray-700 py-4">
            <p>Access is restricted to students and faculty.</p>
            <p>Please sign in with your <span className="font-semibold text-blue-500">{ALLOWED_DOMAIN}</span> email.</p>
        </div>

        <button
          onClick={login}
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-3 font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-wait"
        >
          {loading ? (
            'Signing in...'
          ) : (
            <>
              <GoogleIcon />
              Sign in with Google
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
