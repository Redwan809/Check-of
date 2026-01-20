
import React from 'react';
import Logo from '../Logo';

interface ChatSuggestionsProps {
  onInputChange: (val: string) => void;
}

const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({ onInputChange }) => {
  return (
    <div className="min-h-full flex flex-col items-center justify-center text-center px-6 py-12 max-w-3xl mx-auto">
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-red-600/10 blur-[60px] rounded-full"></div>
        <Logo size={80} className="relative z-10" />
      </div>
      
      <h1 className="text-2xl sm:text-3xl font-medium text-white mb-2">আমি RedX</h1>
      <p className="text-gray-500 mb-10 text-sm">আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-auto sm:mb-0">
        {[
          { title: "Make Advanced Calculator", text: "একটি আধুনিক এবং শক্তিশালী ক্যালকুলেটর অ্যাপ" },
          { title: "প্রোফেশনাল পোর্টফোলিও ডিজাইন", text: "আধুনিক অ্যানিমেশনসহ একটি ওয়েবসাইট" },
          { title: "জাভাস্script লজিক সমাধান", text: "জটিল ডেটা প্রসেসিংয়ের কোড" },
          { title: "ব্যবসায়িক ইমেইল ড্রাফট", text: "প্রফেশনাল মিটিং রিকোয়েস্টের জন্য" }
        ].map((suggestion, idx) => (
          <button 
            key={idx}
            onClick={() => {
              onInputChange(suggestion.title);
            }}
            className="p-4 bg-[#171717] border border-[#262626] rounded-xl text-left hover:border-[#444] hover:bg-[#1a1a1a] transition-all duration-150 group"
          >
            <p className="text-sm font-semibold text-[#ececec] group-hover:text-white">{suggestion.title}</p>
            <p className="text-xs text-gray-500 mt-1">{suggestion.text}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatSuggestions;
