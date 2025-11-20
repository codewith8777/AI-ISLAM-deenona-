import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import InputArea from './components/InputArea';
import MessageItem from './components/MessageItem';
import EmptyState from './components/EmptyState';
import Sidebar from './components/Sidebar';
import { Message, ChatSession } from './types';
import { sendMessageToGemini } from './services/geminiService';

// Simple ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  // State
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load sessions from LocalStorage on mount
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem('albayan_sessions');
      if (savedSessions) {
        const parsed = JSON.parse(savedSessions);
        setSessions(parsed);
        if (parsed.length > 0) {
          // Optional: Auto-select most recent? Or start fresh?
          // Let's start fresh by default, user can select history.
        }
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  // Save sessions to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem('albayan_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSessionId, sessions]); // Scroll when session changes or new messages added

  // Derived state: Current messages
  const currentMessages = currentSessionId 
    ? sessions.find(s => s.id === currentSessionId)?.messages || [] 
    : [];

  const handleSend = async (text: string) => {
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      text: text,
      timestamp: Date.now(),
    };

    setIsLoading(true);

    let activeSessionId = currentSessionId;
    let updatedSessions = [...sessions];

    // If no active session, create one
    if (!activeSessionId) {
      const newSession: ChatSession = {
        id: generateId(),
        title: text.length > 30 ? text.substring(0, 30) + '...' : text,
        messages: [userMessage],
        createdAt: Date.now(),
      };
      updatedSessions = [newSession, ...updatedSessions];
      activeSessionId = newSession.id;
      setSessions(updatedSessions);
      setCurrentSessionId(activeSessionId);
    } else {
      // Update existing session
      updatedSessions = updatedSessions.map(s => 
        s.id === activeSessionId 
          ? { ...s, messages: [...s.messages, userMessage] }
          : s
      );
      setSessions(updatedSessions);
    }

    try {
      // Get history for API context (limit to last 20 messages for efficiency)
      const history = updatedSessions
        .find(s => s.id === activeSessionId)
        ?.messages.slice(-20) || [userMessage];

      const response = await sendMessageToGemini(text, history);
      
      const aiMessage: Message = {
        id: generateId(),
        role: 'model',
        text: response.text,
        sources: response.sources,
        timestamp: Date.now(),
      };

      // Update session with AI response
      setSessions(prev => prev.map(s => 
        s.id === activeSessionId 
          ? { ...s, messages: [...s.messages, aiMessage] }
          : s
      ));

    } catch (error) {
      const errorMessage: Message = {
        id: generateId(),
        role: 'model',
        text: 'عذراً، حدث خطأ أثناء الاتصال بالخدمة. يرجى المحاولة مرة أخرى لاحقاً.',
        isError: true,
        timestamp: Date.now(),
      };
      
      setSessions(prev => prev.map(s => 
        s.id === activeSessionId 
          ? { ...s, messages: [...s.messages, errorMessage] }
          : s
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setIsSidebarOpen(false);
  };

  const handleSelectSession = (id: string) => {
    setCurrentSessionId(id);
    setIsSidebarOpen(false);
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmDelete = window.confirm("هل أنت متأكد من حذف هذه المحادثة؟");
    if (confirmDelete) {
      setSessions(prev => prev.filter(s => s.id !== id));
      if (currentSessionId === id) {
        setCurrentSessionId(null);
      }
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative transition-all duration-300 ease-in-out">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto relative">
          <div className="max-w-4xl mx-auto w-full min-h-full flex flex-col">
            <div className="flex-1 p-4 pb-4">
              {currentMessages.length === 0 ? (
                <EmptyState onSelectPrompt={handleSend} />
              ) : (
                <>
                  {currentMessages.map((msg) => (
                    <MessageItem key={msg.id} message={msg} />
                  ))}
                  {isLoading && (
                    <div className="flex justify-start w-full mb-6 animate-pulse">
                       <div className="flex items-center gap-2 ml-3">
                          <div className="w-8 h-8 bg-islamic-100 rounded-full flex items-center justify-center">
                             <div className="w-4 h-4 bg-islamic-400 rounded-full animate-ping"></div>
                          </div>
                          <span className="text-sm text-gray-400">جاري البحث في المصادر الموثوقة...</span>
                       </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
          </div>
        </main>

        <div className="sticky bottom-0 w-full z-20">
           <InputArea onSend={handleSend} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default App;