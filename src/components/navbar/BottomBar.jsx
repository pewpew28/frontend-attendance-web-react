import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomBar = ({ menuItems }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Filter only main menu items (not groups) and limit to 5 items
  const bottomMenuItems = menuItems
    .filter(item => item.type !== 'group')
    .slice(0, 5);

  const handleClick = (href) => {
    navigate(href);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg lg:hidden z-40">
      <nav className="flex justify-around items-center h-16 px-2">
        {bottomMenuItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <button
              key={idx}
              onClick={() => handleClick(item.href)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors duration-200 ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {Icon && <Icon size={24} className="mb-1" />}
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomBar;