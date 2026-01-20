
import React from 'react';
import { ChatSession } from '../types';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  sessions, 
  activeSessionId, 
  onSelectSession, 
  onNewChat,
  onDeleteSession,
  isOpen,
  onClose
}) => {
  return (
    <div className={`
      fixed lg:static inset-y-0 left-0 z-50
      w-72 lg:w-64 bg-[#0d0d0d] border-r border-[#262626] h-screen flex flex-col text-[#ececec]
      transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="p-4 flex items-center justify-between">
        <button 
          onClick={onNewChat}
          className="flex-1 flex items-center justify-between py-2 px-3 hover:bg-[#212121] border border-transparent hover:border-[#333] rounded-lg transition-all duration-200 text-sm font-medium"
        >
          <div className="flex items-center gap-2">
            <i className="fa-regular fa-pen-to-square text-gray-400"></i>
            <span>নতুন চ্যাট</span>
          </div>
          <span className="hidden sm:inline-block text-[10px] bg-[#1a1a1a] border border-[#333] px-1.5 py-0.5 rounded text-gray-500">Ctrl K</span>
        </button>
        
        <button 
          onClick={onClose}
          className="lg:hidden ml-2 p-2 text-gray-500 hover:text-gray-300 rounded-lg"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 mt-2">
        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
          সাম্প্রতিক
        </div>
        <div className="space-y-0.5">
          {sessions.length === 0 ? (
            <div className="text-xs text-gray-500 px-3 py-4 italic">কোনো চ্যাট নেই</div>
          ) : (
            sessions.map((session) => (
              <div 
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`group relative flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors duration-150 ${
                  activeSessionId === session.id 
                    ? 'bg-[#212121] text-white' 
                    : 'text-[#9b9b9b] hover:bg-[#1a1a1a] hover:text-[#ececec]'
                }`}
              >
                <span className="flex-1 truncate text-sm">
                  {session.title || 'শিরোনামহীন চ্যাট'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  className="opacity-0 lg:group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
                >
                  <i className="fa-solid fa-xmark text-[10px]"></i>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="p-4 border-t border-[#262626] space-y-4 mb-2 lg:mb-0">
        <button className="w-full flex items-center gap-2 text-sm text-[#9b9b9b] hover:text-white transition-colors py-1 px-1">
          <i className="fa-regular fa-star"></i>
          <span>স্টারড</span>
        </button>
        <div className="flex items-center gap-3 pt-2">
          <div className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center text-white font-bold text-xs border border-[#333]">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate text-[#ececec]">ব্যবহারকারী সেটিংস</p>
          </div>
          <i className="fa-solid fa-chevron-up text-[10px] text-gray-500"></i>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
