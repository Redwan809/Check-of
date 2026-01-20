
import React from 'react';

interface ScrollToBottomButtonProps {
  onClick: () => void;
}

const ScrollToBottomButton: React.FC<ScrollToBottomButtonProps> = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="absolute bottom-32 left-1/2 -translate-x-1/2 z-30 bg-[#1a1a1a] border border-[#333] text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-2xl hover:bg-[#222] transition-all animate-bounce"
    >
      <i className="fa-solid fa-arrow-down"></i>
      <span>নতুন মেসেজ আসছে</span>
    </button>
  );
};

export default ScrollToBottomButton;
