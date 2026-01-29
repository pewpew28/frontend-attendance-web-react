import React, { useState, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Home, ShoppingCart, BarChart, Settings, User } from 'lucide-react';
import Navbar from '../navbar/Navbar';
import Sidebar from '../navbar/Sidebar';
import BottomBar from '../navbar/BottomBar';

const GuestLayout = ({ menuItems: customMenuItems }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useContext(AuthContext);

  // Default menu items
  const defaultMenuItems = [
    {
      icon: Home,
      label: 'Dashboard',
      href: '/dashboard'
    },
    {
      icon: ShoppingCart,
      label: 'Orders',
      href: '/orders'
    },
    {
      icon: BarChart,
      label: 'Analytics',
      href: '/analytics'
    },
    {
      icon: User,
      label: 'Profile',
      href: '/profile'
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/settings'
    }
  ];

  const menuItems = customMenuItems || defaultMenuItems;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        showSearch={true}
        onLogout={logout}
        user={user}
      />
      
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          menuItems={menuItems}
        />
        
        {/* Main Content - Add padding bottom for mobile bottombar */}
        <main className="flex-1 p-4 sm:p-6 pb-20 lg:pb-6">
          <Outlet />
        </main>
      </div>

      {/* BottomBar - Only visible on mobile */}
      <BottomBar menuItems={menuItems} />
    </div>
  );
};

export default GuestLayout;