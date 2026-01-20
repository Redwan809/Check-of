
import React, { useRef, useEffect, useState } from 'react';
import { Message, ChatMode } from '../types';
import MessageItem from './MessageItem';
import ChatInputArea from './Chat/ChatInputArea';
import ChatSuggestions from './Chat/ChatSuggestions';
import ScrollToBottomButton from './Chat/ScrollToBottomButton';

interface ChatContainerProps {
  messages: Message[];
  inputValue: string;
  onInputChange: (val: string) => void;
  onSendMessage: () => void;
  onRegenerate: () => void;
  onOptionSelect?: (option: string) => void;
  isLoading: boolean;
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  inputValue,
  onInputChange,
  onSendMessage,
  onRegenerate,
  onOptionSelect,
  isLoading,
  mode,
  onModeChange
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < 100;
    setIsAtBottom(atBottom);
    
    if (!atBottom && isLoading) {
      setShowScrollButton(true);
    } else if (atBottom) {
      setShowScrollButton(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current && isAtBottom) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading, isAtBottom]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
      setIsAtBottom(true);
      setShowScrollButton(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#0d0d0d] relative overflow-hidden">
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto custom-scrollbar pb-40"
      >
        {messages.length === 0 ? (
          <ChatSuggestions onInputChange={onInputChange} />
        ) : (
          <div className="w-full">
            {messages.map((msg, index) => (
              <MessageItem 
                key={msg.id} 
                message={msg} 
                isLast={index === messages.length - 1}
                onRegenerate={onRegenerate}
                onOptionSelect={onOptionSelect}
              />
            ))}
            <div className="h-4"></div>
          </div>
        )}
      </div>

      {showScrollButton && <ScrollToBottomButton onClick={scrollToBottom} />}

      <ChatInputArea
        inputValue={inputValue}
        onInputChange={onInputChange}
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        mode={mode}
        onModeChange={onModeChange}
      />
    </div>
  );
};

export default ChatContainer;
