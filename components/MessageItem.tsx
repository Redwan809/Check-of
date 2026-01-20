
import React, { useMemo, useRef, useState } from 'react';
import { Message } from '../types';
import Logo from './Logo';

import MessageHeader from './Chat/Message/MessageHeader';
import MessageSteps from './Chat/Message/MessageSteps';
import MarkdownContent from './Chat/Message/MarkdownContent';
import InteractiveOptions from './Chat/Message/InteractiveOptions';
import MessageActions from './Chat/Message/MessageActions';

interface MessageItemProps {
  message: Message;
  onRegenerate?: () => void;
  onOptionSelect?: (option: string) => void;
  isLast?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, onRegenerate, onOptionSelect, isLast }) => {
  const isUser = message.role === 'user';
  const containerRef = useRef<HTMLDivElement>(null);
  const [copyFullContentStatus, setCopyFullContentStatus] = useState<'idle' | 'copied'>('idle');
  
  const parsedData = useMemo(() => {
    const content = message.content || '';
    const steps: { name: string; isDone: boolean }[] = [];
    let interactiveStructure = null;
    
    // 1. Precise and Flexible JSON extraction
    const structMatch = content.match(/\[INTERACTIVE_STRUCTURE:\s*(\{[\s\S]*?)(?:\s*\]|$)/);
    if (structMatch && structMatch[1]) {
      let jsonStr = structMatch[1].trim();
      try {
        // Try direct parse first
        interactiveStructure = JSON.parse(jsonStr);
      } catch (e) {
        // Enhanced auto-closing for streaming JSON
        try {
          let fixedJson = jsonStr;
          const openBraces = (fixedJson.match(/\{/g) || []).length;
          const closeBraces = (fixedJson.match(/\}/g) || []).length;
          for(let i=0; i < openBraces - closeBraces; i++) fixedJson += '}';
          
          const openBrackets = (fixedJson.match(/\[/g) || []).length;
          const closeBrackets = (fixedJson.match(/\]/g) || []).length;
          for(let i=0; i < openBrackets - closeBrackets; i++) fixedJson += ']';
          
          interactiveStructure = JSON.parse(fixedJson);
        } catch (innerE) {
          // Still failing, interactiveStructure remains null
        }
      }
    }

    // 2. Parse Steps logic
    const stepRegex = /\[STEP:\s*(.*?)\]/g;
    const matches = Array.from(content.matchAll(stepRegex)) as RegExpExecArray[];
    
    matches.forEach((match, index) => {
      const stepName = match[1];
      const nextMatchIndex = matches[index + 1]?.index || content.length;
      const stepContent = content.substring(match.index!, nextMatchIndex);
      
      let isDone = (index < matches.length - 1) || stepContent.includes("ধাপ সম্পন্ন");
      
      if (isLast && interactiveStructure && stepName.toUpperCase().includes("PLANNING")) {
        isDone = false; 
      } else if (!isLast) {
        isDone = true; 
      }

      steps.push({ name: stepName, isDone });
    });
    
    // 3. CONTENT CLEANING
    let cleanContent = content;
    const interactiveTagStart = cleanContent.indexOf('[INTERACTIVE_STRUCTURE:');
    if (interactiveTagStart !== -1) {
      cleanContent = cleanContent.substring(0, interactiveTagStart);
    }
    cleanContent = cleanContent.replace(/\[STEP:.*?\]/g, '').replace(/ধাপ সম্পন্ন/g, '').trim();

    return { steps, cleanContent, interactiveStructure };
  }, [message.content, isLast]);

  const handleCopyFullContent = async () => {
    try {
      await navigator.clipboard.writeText(parsedData.cleanContent);
      setCopyFullContentStatus('copied');
      setTimeout(() => setCopyFullContentStatus('idle'), 2000);
    } catch (err) { console.error("Copy failed", err); }
  };

  const handleInteractiveDone = (selections: Record<string, string>) => {
    if (!onOptionSelect) return;
    const selectionSummary = Object.entries(selections)
      .map(([cat, val]) => `${cat}: ${val}`)
      .join(', ');
    onOptionSelect(selectionSummary);
  };

  return (
    <div className={`group w-full ${isUser ? 'py-3' : 'py-6'} border-b border-[#111]/50`}>
      <div className="max-w-3xl mx-auto flex gap-4 sm:gap-6 px-4">
        <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
          isUser ? 'bg-[#1a1a1a] border border-[#262626]' : 'bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] shadow-xl border border-[#333]'
        }`}>
          {isUser ? <i className="fa-solid fa-user text-[10px] text-gray-500"></i> : <Logo size={20} />}
        </div>
        
        <div className="flex-1 min-w-0">
          <MessageHeader isUser={isUser} />
          <div ref={containerRef} className="text-[14px] sm:text-[15px] leading-relaxed text-[#d1d1d1]">
            {!isUser && parsedData.steps.length > 0 && (
              <MessageSteps steps={parsedData.steps} />
            )}

            {parsedData.cleanContent && (
              <MarkdownContent content={parsedData.cleanContent} onCopyCode={() => {}} />
            )}

            {!isUser && parsedData.interactiveStructure && ( // Render InteractiveOptions as soon as structure is available
              <div className="animate-fade-up">
                <InteractiveOptions 
                  structure={parsedData.interactiveStructure} 
                  onDone={handleInteractiveDone} 
                  isStreaming={!isLast} // Pass streaming status
                />
              </div>
            )}

            {!isUser && !parsedData.cleanContent && !parsedData.interactiveStructure && (
              <div className="flex gap-2 py-4">
                <span className="w-2 h-2 bg-red-600/40 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-red-600/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-red-600/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
          </div>

          {!isUser && parsedData.cleanContent && (
            <MessageActions 
              onCopyFullContent={handleCopyFullContent} 
              copyStatus={copyFullContentStatus} 
              onRegenerate={onRegenerate} 
              isLast={isLast!} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
