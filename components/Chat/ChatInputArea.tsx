
import React, { useRef, useEffect } from 'react';
import { ChatMode } from '../../types';

interface ChatInputAreaProps {
  inputValue: string;
  onInputChange: (val: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
}

const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  inputValue,
  onInputChange,
  onSendMessage,
  isLoading,
  mode,
  onModeChange
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const adjustTextareaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 240)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/95 to-transparent z-20">
      <div className="max-w-3xl mx-auto relative">
        <div className="bg-[#171717] border border-[#262626] rounded-2xl claude-input-shadow overflow-hidden transition-all duration-200 focus-within:border-[#444]">
          <textarea
            ref={inputRef}
            rows={1}
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="RedX-কে কিছু জিজ্ঞাসা করুন..."
            className="w-full bg-transparent px-4 pt-4 pb-14 text-[#ececec] placeholder-gray-500 focus:outline-none resize-none min-h-[60px] text-sm leading-relaxed"
          />
          
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#0d0d0d] p-1 rounded-lg border border-[#262626]">
              <button 
                onClick={() => onModeChange(ChatMode.FAST)}
                className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-1.5 rounded-md transition-all ${mode === ChatMode.FAST ? 'bg-[#262626] shadow-sm text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                ফাস্ট
              </button>
              <button 
                onClick={() => onModeChange(ChatMode.PRO)}
                className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-1.5 rounded-md transition-all ${mode === ChatMode.PRO ? 'bg-[#262626] shadow-sm text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                প্রো
              </button>
            </div>
          </div>

          <button
            onClick={onSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className={`absolute right-3 bottom-3 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
              !inputValue.trim() || isLoading
                ? 'bg-[#262626] text-gray-600'
                : 'bg-[#ff4d4d] text-white hover:bg-[#ff3333] shadow-[0_0_15px_rgba(255,77,77,0.3)]'
            }`}
          >
            {isLoading ? (
              <i className="fa-solid fa-circle-notch fa-spin text-xs"></i>
            ) : (
              <i className="fa-solid fa-arrow-up text-xs"></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInputArea;
