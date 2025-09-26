import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import NavigationArrows from './NavigationArrows';

const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 animate-slide-in">
          <Outlet />
        </div>
      </main>
      <NavigationArrows />
    </div>
  );
};

export default Layout;