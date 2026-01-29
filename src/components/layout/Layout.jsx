import React, { useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  Home,
  ShoppingCart,
  BarChart,
  Settings,
  User,
  AlarmCheck,
} from "lucide-react";
import Navbar from "../navbar/Navbar";
import Sidebar from "../navbar/Sidebar";
import BottomBar from "../navbar/BottomBar";
import { bottomBarMenuItems, sidebarMenuItems } from "../../utils/MenuItem";

const Layout = ({ menuItems: customMenuItems }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user, isAuthenticated } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        showSearch={true}
        onLogout={logout}
        user={user}
        isAuthenticated={isAuthenticated}
      />

      <div className="flex">
        {isAuthenticated && (
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            menuItems={sidebarMenuItems}
          />
        )}

        <main className="flex-1 p-4 sm:p-6 pb-20 lg:pb-6">
          <Outlet />
        </main>
      </div>

      {isAuthenticated && <BottomBar menuItems={bottomBarMenuItems} />}
    </div>
  );
};

export default Layout;
