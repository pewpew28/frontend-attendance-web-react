import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Heart, ShoppingCart, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUserDropdownItems } from '../../utils/MenuItem';
import { ROUTES } from '../../utils/Routes';

const Navbar = ({ onMenuClick, showSearch = true, onLogout, user, isAuthenticated = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate(isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME);
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  // Get dropdown items with handlers
  const userDropdownItems = getUserDropdownItems(navigate, handleLogout);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-30">
      <div className="max-w-full mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Menu Button */}
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <button
                onClick={onMenuClick}
                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
                aria-label="Toggle Menu"
              >
                <Menu size={24} />
              </button>
            )}
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={handleLogoClick}
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold text-gray-800 hidden sm:block">MyApp</span>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile */}
          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Cari..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {isAuthenticated ? (
              <>
                {/* Desktop Icons - Hidden on mobile */}
                <button 
                  className="p-2 rounded-lg hover:bg-gray-100 relative hidden sm:block"
                  aria-label="Notifications"
                  onClick={() => navigate(ROUTES.NOTIFICATIONS)}
                >
                  <Bell size={22} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button 
                  className="p-2 rounded-lg hover:bg-gray-100 hidden sm:block"
                  aria-label="Favorites"
                  onClick={() => navigate(ROUTES.FAVORITES)}
                >
                  <Heart size={22} />
                </button>
                <button 
                  className="p-2 rounded-lg hover:bg-gray-100 hidden sm:block"
                  aria-label="Cart"
                  onClick={() => navigate(ROUTES.CART)}
                >
                  <ShoppingCart size={22} />
                </button>
                
                {/* User Avatar with Dropdown */}
                <div className="relative ml-2" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold hover:shadow-lg transition-shadow"
                    aria-label="User Menu"
                  >
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">
                          {user?.name || 'User Name'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {user?.email || 'user@example.com'}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        {userDropdownItems.map((item, index) => {
                          if (item.divider) {
                            return <div key={index} className="my-1 border-t border-gray-200" />;
                          }

                          return (
                            <button
                              key={index}
                              onClick={() => {
                                item.onClick();
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors ${item.className || ''}`}
                            >
                              {item.icon && <item.icon size={18} />}
                              <span className="text-sm font-medium flex-1">{item.label}</span>
                              {item.badge && (
                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                  {item.badge}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Guest User Actions */}
                <button
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className="px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate(ROUTES.REGISTER)}
                  className="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition-colors hidden sm:block"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;