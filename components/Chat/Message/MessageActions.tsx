
import React from 'react';

interface MessageActionsProps {
  onCopyFullContent: () => void;
  copyStatus: 'idle' | 'copied';
  onRegenerate?: () => void;
  isLast: boolean;
}

const MessageActions: React.FC<MessageActionsProps> = ({
  onCopyFullContent,
  copyStatus,
  onRegenerate,
  isLast,
}) => {
  return (
    <div className="mt-2 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <button 
        onClick={onCopyFullContent}
        className={`text-[10px] flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#262626] transition-all ${
          copyStatus === 'copied' ? 'text-green-400 bg-green-400/5 border-green-400/20' : 'text-gray-500 hover:text-white hover:bg-white/5'
        }`}
      >
        <i className={`fa-regular ${copyStatus === 'copied' ? 'fa-check' : 'fa-copy'}`}></i>
        <span className="font-bold tracking-tight uppercase">{copyStatus === 'copied' ? 'Copied' : 'Copy'}</span>
      </button>
      
      <div className="flex items-center gap-0.5 bg-[#171717]/30 p-0.5 rounded-lg border border-[#262626]">
        <button className="text-gray-600 hover:text-white text-[9px] w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/5 transition-all">
          <i className="fa-regular fa-thumbs-up"></i>
        </button>
        <button className="text-gray-600 hover:text-red-400 text-[9px] w-7 h-7 flex items-center justify-center rounded-md hover:bg-red-500/10 transition-all">
          <i className="fa-regular fa-thumbs-down"></i>
        </button>
      </div>
      
      {isLast && onRegenerate && (
        <button 
          onClick={onRegenerate}
          className="text-gray-600 hover:text-red-500 text-[10px] flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-all font-bold uppercase tracking-tight"
        >
          <i className="fa-solid fa-rotate-right"></i>
          <span>Redo</span>
        </button>
      )}
    </div>
  );
};

export default MessageActions;
