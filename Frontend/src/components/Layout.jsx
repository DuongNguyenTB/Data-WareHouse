import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => (
  <div className="flex">
    <Sidebar />
    <main className="flex-1 ml-64 bg-gray-50 min-h-screen p-8">
      <Outlet />
    </main>
  </div>
);
export default Layout;