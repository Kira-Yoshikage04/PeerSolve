import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Role } from '../types';
import { useModal } from '../hooks/useModal';
import ThemeSwitcher from './ThemeSwitcher';

const PlusIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
);

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { openModal } = useModal();

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/login');
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navLinkClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const activeNavLinkClasses = "bg-slate-200 dark:bg-gray-700 text-blue-600 dark:text-blue-400 font-semibold";
  const inactiveNavLinkClasses = "text-gray-600 dark:text-gray-300 hover:bg-slate-200/70 dark:hover:bg-gray-700/70";

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm sticky top-0 z-40 border-b border-slate-200 dark:border-gray-700/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-gray-800 dark:text-white">PeerSolve</span>
            </Link>
            {user && (
              <nav className="hidden md:flex items-center space-x-2">
                <NavLink to="/" end className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`}>Feed</NavLink>
                <NavLink to="/leaderboard" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`}>Leaderboard</NavLink>
                <NavLink to="/about" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`}>About</NavLink>
              </nav>
            )}
          </div>
          <div className="flex items-center space-x-4 sm:space-x-6">
            <ThemeSwitcher />
            {user && (
                 <button
                    onClick={() => openModal('newDoubt')}
                    className="inline-flex items-center justify-center p-2 sm:px-3 sm:py-1.5 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition shadow-sm"
                    aria-label="Post a new doubt"
                >
                    <PlusIcon />
                    <span className="hidden sm:inline ml-2">Post Doubt</span>
                </button>
            )}
            
            {user ? (
              <div className="relative" ref={dropdownRef}>
                 <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2 focus:outline-none p-1 rounded-full focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 transition-transform hover:scale-105">
                    <img className="h-9 w-9 rounded-full" src={user.avatarUrl} alt={user.name} />
                    <span className="hidden sm:inline font-medium text-gray-700 dark:text-gray-200">{user.name}</span>
                    <svg className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                 </button>
                <div className={`absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5 origin-top-right transition-all duration-200 ease-out transform ${isDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                    <NavLink to="/profile" onClick={() => setIsDropdownOpen(false)} className={({ isActive }) => `block px-4 py-2 text-sm ${isActive ? 'bg-slate-100 dark:bg-gray-600 font-semibold' : ''} text-gray-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-gray-600`}>My Profile</NavLink>
                    <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-gray-600"
                    >
                        Logout
                    </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;