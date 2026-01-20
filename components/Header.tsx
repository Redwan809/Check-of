
import React, { useState, useRef, useEffect } from 'react';
import { ChatMode } from '../types';
import Logo from './Logo';

interface HeaderProps {
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  title?: string;
  onMenuClick: () => void;
  onDeleteChat: () => void;
  onRenameChat: (newName: string) => void;
}

const Header: React.FC<HeaderProps> = ({ mode, onModeChange, title, onMenuClick, onDeleteChat, onRenameChat }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRename = () => {
    const newName = prompt("চ্যাটের নতুন নাম লিখুন:", title || "");
    if (newName && newName.trim()) {
      onRenameChat(newName.trim());
    }
    setShowMenu(false);
  };

  return (
    <header className="h-14 border-b border-[#262626] bg-[#0d0d0d] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-gray-400 hover:bg-[#1a1a1a] rounded-lg transition-colors"
        >
          <i className="fa-solid fa-bars"></i>
        </button>
        
        <div className="flex items-center gap-2.5">
          <Logo size={24} />
          <div className="hidden sm:flex flex-col leading-none">
            <span className="text-sm font-bold text-white tracking-tight">RedX</span>
            <span className="text-[10px] text-[#ff4d4d] font-bold uppercase tracking-widest">{mode}</span>
          </div>
        </div>

        <div className="h-4 w-[1px] bg-[#262626] mx-1 hidden sm:block"></div>
        
        <span className="text-sm font-medium text-[#9b9b9b] truncate max-w-[140px] xs:max-w-[200px] sm:max-w-[300px]">
          {title || "নতুন চ্যাট"}
        </span>
      </div>

      <div className="flex items-center gap-1 sm:gap-3 relative">
        <button className="hidden xs:block text-xs text-gray-400 hover:bg-[#1a1a1a] hover:text-white px-3 py-1.5 rounded-lg transition-colors border border-[#262626]">
          শেয়ার
        </button>
        
        <div ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-[#1a1a1a] hover:text-white border border-[#262626] transition-colors ${showMenu ? 'bg-[#1a1a1a] text-white' : ''}`}
          >
            <i className="fa-solid fa-ellipsis"></i>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#171717] border border-[#262626] rounded-xl shadow-2xl z-50 py-1 overflow-hidden">
              <button 
                onClick={handleRename}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-[#262626] hover:text-white flex items-center gap-3 transition-colors"
              >
                <i className="fa-regular fa-pen-to-square"></i>
                রিনেম চ্যাট
              </button>
              <button 
                onClick={() => { onDeleteChat(); setShowMenu(false); }}
                className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition-colors"
              >
                <i className="fa-regular fa-trash-can"></i>
                ডিলিট চ্যাট
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
