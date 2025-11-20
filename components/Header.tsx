import React from 'react';
import { MenuIcon } from './Icons';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuClick}
            className="p-2 -mr-2 rounded-lg text-gray-600 hover:bg-gray-100 md:hidden"
            aria-label="Open Menu"
          >
            <MenuIcon />
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-islamic-500 to-islamic-700 rounded-lg flex items-center justify-center shadow-lg transform rotate-3">
             <span className="text-white font-serif font-bold text-xl pb-1">ب</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-islamic-900 font-serif">البيان</h1>
            <p className="text-[10px] text-islamic-600 font-medium hidden sm:block">مساعدك الإسلامي الذكي</p>
          </div>
        </div>
        
        <div className="flex gap-2">
            <span className="px-2 py-1 bg-islamic-50 text-islamic-700 rounded-md text-xs border border-islamic-100">
                مدعوم بمصادر موثوقة
            </span>
        </div>
      </div>
    </header>
  );
};

export default Header;