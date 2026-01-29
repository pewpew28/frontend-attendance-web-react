import React, { useState } from 'react';
import { X } from 'lucide-react';
import MenuItem from './MenuItem';
import MenuGroup from './MenuGroup';

const Sidebar = ({ isOpen, onClose, menuItems }) => {
  const [openGroups, setOpenGroups] = useState({});

  const toggleGroup = (groupTitle) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupTitle]: !prev[groupTitle]
    }));
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:shadow-none overflow-y-auto pb-20 lg:pb-0`}
      >
        {/* Header Sidebar - Only on mobile */}
        <div className="flex items-center justify-between p-4 border-b lg:hidden">
          <h2 className="text-xl font-bold text-gray-800">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item, idx) => {
            if (item.type === 'group') {
              return (
                <MenuGroup
                  key={idx}
                  title={item.title}
                  icon={item.icon}
                  items={item.items}
                  isOpen={openGroups[item.title]}
                  onToggle={() => toggleGroup(item.title)}
                  onItemClick={onClose}
                />
              );
            }
            return (
              <MenuItem
                key={idx}
                {...item}
                onClick={onClose}
              />
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;