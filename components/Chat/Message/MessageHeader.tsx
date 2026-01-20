
import React from 'react';

interface MessageHeaderProps {
  isUser: boolean;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({ isUser }) => {
  return (
    <div className="flex items-center gap-2 mb-2.5">
      <span className="text-sm font-bold text-[#f0f0f0] tracking-tight">{isUser ? 'আপনি' : 'RedX'}</span>
    </div>
  );
};

export default MessageHeader;
