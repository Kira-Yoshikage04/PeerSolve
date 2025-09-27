import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Role } from '../types';
import Spinner from './Spinner';

interface ProtectedRouteProps {
  // FIX: Replace JSX.Element with React.ReactElement to resolve namespace error.
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
        <div className="flex justify-center items-center h-full w-full p-12">
            <Spinner />
        </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!user.accessGranted) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">Your account does not have permission to access this platform.</p>
            <p className="text-md text-gray-500 mt-2">If you believe this is an error, please contact support.</p>
        </div>
      )
  }

  return children;
};

export default ProtectedRoute;
