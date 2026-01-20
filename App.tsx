
import React, { useState, useCallback, useEffect } from 'react';
import { ChatMode, Message, ChatSession } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatContainer from './components/ChatContainer';
import { geminiService } from './services/geminiService';

const STORAGE_KEY = 'redx_chat_history_v1';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [mode, setMode] = useState<ChatMode>(ChatMode.FAST);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert ISO dates back to Date objects
        const hydrated = parsed.map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt),
          lastModified: new Date(s.lastModified),
          messages: s.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }))
        }));
        setSessions(hydrated);
        if (hydrated.length > 0) {
          setActiveSessionId(hydrated[0].id);
        }
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Save to local storage whenever sessions change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const handleNewChat = useCallback(() => {
    const newId = crypto.randomUUID();
    const newSession: ChatSession = {
      id: newId,
      title: '',
      messages: [],
      createdAt: new Date(),
      lastModified: new Date(),
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
    setIsSidebarOpen(false);
  }, []);

  const handleDeleteSession = useCallback((id?: string) => {
    const targetId = id || activeSessionId;
    if (!targetId) return;

    if (confirm("আপনি কি নিশ্চিতভাবে এই চ্যাটটি ডিলিট করতে চান?")) {
      setSessions(prev => {
        const filtered = prev.filter(s => s.id !== targetId);
        if (activeSessionId === targetId) {
          setActiveSessionId(filtered[0]?.id || '');
        }
        return filtered;
      });
      // If no sessions left, local storage will be handled by the effect or clear it now
      if (sessions.length <= 1) localStorage.removeItem(STORAGE_KEY);
    }
  }, [activeSessionId, sessions.length]);

  const handleRenameSession = useCallback((newName: string) => {
    setSessions(prev => prev.map(s => 
      s.id === activeSessionId ? { ...s, title: newName } : s
    ));
  }, [activeSessionId]);

  const processResponse = async (targetSessionId: string, currentMessage: string, history: any[], modelMsgId: string, targetMode: ChatMode) => {
    try {
      let accumulatedResponse = '';
      const stream = geminiService.sendMessageStream(currentMessage, targetMode, history);
      
      for await (const chunk of stream) {
        accumulatedResponse += chunk;
        setSessions(prev => prev.map(s => {
          if (s.id === targetSessionId) {
            return {
              ...s,
              messages: s.messages.map(m => 
                m.id === modelMsgId ? { ...m, content: accumulatedResponse } : m
              )
            };
          }
          return s;
        }));
      }
    } catch (error: any) {
      console.error("Failed to fetch AI response:", error);
      const errorMessage = "দুঃখিত, তথ্য সংগ্রহ করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।";
      setSessions(prev => prev.map(s => {
        if (s.id === targetSessionId) {
          return {
            ...s,
            messages: s.messages.map(m => 
              m.id === modelMsgId ? { ...m, content: errorMessage } : m
            )
          };
        }
        return s;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = useCallback(async (textOverride?: string) => {
    const currentMessage = textOverride || inputValue;
    if (!currentMessage.trim() || isLoading) return;

    if (!textOverride) setInputValue('');
    setIsLoading(true);

    let targetSessionId = activeSessionId;
    if (!targetSessionId) {
      const newId = crypto.randomUUID();
      targetSessionId = newId;
      const newSession: ChatSession = {
        id: newId,
        title: currentMessage.slice(0, 30) + (currentMessage.length > 30 ? '...' : ''),
        messages: [],
        createdAt: new Date(),
        lastModified: new Date(),
      };
      setSessions(prev => [newSession, ...prev]);
      setActiveSessionId(newId);
    }

    const currentSession = sessions.find(s => s.id === targetSessionId);
    const history = (currentSession?.messages || [])
      .map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date(),
      mode: mode,
    };

    const modelMsgId = crypto.randomUUID();
    const modelMsg: Message = {
      id: modelMsgId,
      role: 'model',
      content: '',
      timestamp: new Date(),
      mode: mode,
    };

    setSessions(prev => prev.map(s => {
      if (s.id === targetSessionId) {
        return {
          ...s,
          messages: [...s.messages, userMsg, modelMsg],
          lastModified: new Date(),
          title: s.title || (currentMessage.slice(0, 40) + (currentMessage.length > 40 ? '...' : ''))
        };
      }
      return s;
    }));

    await processResponse(targetSessionId, currentMessage, history, modelMsgId, mode);
  }, [inputValue, isLoading, activeSessionId, mode, sessions]);

  const handleOptionSelect = (option: string) => {
    handleSendMessage(`আমি এই অপশনটি সিলেক্ট করেছি: ${option}`);
  };

  const handleRegenerate = useCallback(async () => {
    if (isLoading || !activeSession || activeSession.messages.length < 2) return;

    const messages = activeSession.messages;
    const lastUserMessageIndex = [...messages].reverse().findIndex(m => m.role === 'user');
    
    if (lastUserMessageIndex === -1) return;
    
    const actualIndex = messages.length - 1 - lastUserMessageIndex;
    const lastUserMessage = messages[actualIndex].content;
    const lastModelMsgId = messages[messages.length - 1].id;

    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          messages: s.messages.map(m => m.id === lastModelMsgId ? { ...m, content: '' } : m)
        };
      }
      return s;
    }));

    setIsLoading(true);
    const history = messages.slice(0, actualIndex).map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    await processResponse(activeSessionId, lastUserMessage, history, lastModelMsgId, mode);
  }, [isLoading, activeSession, activeSessionId, mode]);

  return (
    <div className="flex h-screen bg-[#0d0d0d] overflow-hidden relative">
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar 
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={(id) => {
          setActiveSessionId(id);
          setIsSidebarOpen(false);
        }}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        <Header 
          mode={mode} 
          onModeChange={setMode} 
          title={activeSession?.title}
          onMenuClick={() => setIsSidebarOpen(true)}
          onDeleteChat={() => handleDeleteSession()}
          onRenameChat={handleRenameSession}
        />
        <ChatContainer 
          messages={activeSession?.messages || []}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSendMessage={() => handleSendMessage()}
          onRegenerate={handleRegenerate}
          onOptionSelect={handleOptionSelect}
          isLoading={isLoading}
          mode={mode}
          onModeChange={setMode}
        />
      </main>
    </div>
  );
};

export default App;
