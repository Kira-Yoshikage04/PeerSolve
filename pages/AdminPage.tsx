import React from 'react';
import { useData } from '../hooks/useData';
import Spinner from '../components/Spinner';
// FIX: Import the Role enum for type-safe comparisons.
import { Role } from '../types';

const AdminPage = () => {
  // FIX: Destructure the newly added updateUserAccess function from the useData hook.
  const { users, loadingDoubts, updateUserAccess } = useData();

  if (loadingDoubts) {
    return <div className="flex justify-center mt-12"><Spinner /></div>;
  }
  
  const handleToggleAccess = async (userId: string, currentAccess: boolean) => {
      // Optimistic update can be implemented here for better UX
      await updateUserAccess(userId, !currentAccess);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Admin Panel - User Management</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-slate-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Points</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Access Granted</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt={user.name} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    // FIX: Use the Role enum for a type-safe comparison instead of a magic string.
                    user.role === Role.ADMIN 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' 
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">{user.points}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                   <button 
                        onClick={() => handleToggleAccess(user.id, user.accessGranted)}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                            user.accessGranted ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                    >
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                            user.accessGranted ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;