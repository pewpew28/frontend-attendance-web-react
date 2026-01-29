import React from 'react';
import { ChevronDown } from 'lucide-react';
import MenuItem from './MenuItem';

const MenuGroup = ({ title, icon: Icon, items, isOpen, onToggle, onItemClick }) => {
  return (
    <div className="mb-2">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200"
      >
        {Icon && <Icon size={20} />}
        <span className="font-medium">{title}</span>
        <ChevronDown 
          size={16} 
          className={`ml-auto transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="mt-1 ml-4 space-y-1">
          {items.map((item, idx) => (
            <MenuItem 
              key={idx} 
              {...item} 
              onClick={onItemClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuGroup;