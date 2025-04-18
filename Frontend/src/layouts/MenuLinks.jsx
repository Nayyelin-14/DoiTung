import React from "react";
import { Link } from "react-router-dom";

const MenuLinks = ({ menuItems, activeTab, setActiveTab, toggleMenu }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:gap-12 w-full md:w-auto">
      {menuItems.map((item) => (
        <div
          className="relative px-3 md:px-4 py-2 font-medium cursor-pointer"
          key={item.link}
        >
          <Link
            to={item.link}
            className={`block py-2 text-lg hover:text-yellow-400 ${
              activeTab === item.label ? "text-yellow-400" : ""
            }`}
            onClick={() => {
              setActiveTab(item.label);
              toggleMenu(); // ✅ close the menu on click
            }}
          >
            {item.label}
          </Link>
          {activeTab === item.label && (
            <div className="w-full h-0.5 absolute bg-yellow-500 bottom-0 left-0"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MenuLinks;
