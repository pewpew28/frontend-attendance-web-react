import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const MenuItem = ({ icon: Icon, label, href, onClick, isActive }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const active = isActive || location.pathname === href;

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    }
    navigate(href);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
        active 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {Icon && <Icon size={20} />}
      <span className="font-medium">{label}</span>
    </a>
  );
};

export default MenuItem;