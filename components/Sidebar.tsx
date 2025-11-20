import React from 'react';
import { ChatSession } from '../types';
import { PlusIcon, TrashIcon, XMarkIcon, BookIcon } from './Icons';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  isOpen,
  onClose
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] md:hidden transition-opacity duration-300" 
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed top-0 right-0 bottom-0 w-72 bg-white border-l border-gray-200 z-[70] 
          transform transition-transform duration-300 ease-in-out shadow-2xl
          md:relative md:translate-x-0 md:shadow-none md:z-0
          ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
            <h2 className="text-lg font-bold text-islamic-900 font-serif flex items-center gap-2">
              <BookIcon />
              <span>محفوظات المحادثة</span>
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-500 md:hidden transition-colors"
              aria-label="Close sidebar"
            >
              <XMarkIcon />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="p-4 shrink-0">
            <button
              onClick={() => {
                onNewChat();
                if (window.innerWidth < 768) onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-islamic-600 hover:bg-islamic-700 text-white rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              <PlusIcon />
              <span>محادثة جديدة</span>
            </button>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2 custom-scrollbar">
            {sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center px-4">
                <div className="text-gray-300 mb-2">
                  <BookIcon />
                </div>
                <p className="text-sm text-gray-400">لا توجد محادثات سابقة</p>
              </div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id);
                    if (window.innerWidth < 768) onClose();
                  }}
                  className={`
                    group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 border relative
                    ${currentSessionId === session.id 
                      ? 'bg-islamic-50 border-islamic-200 shadow-sm' 
                      : 'bg-transparent border-transparent hover:bg-gray-50 hover:border-gray-100'
                    }
                  `}
                >
                  <div className="flex-1 min-w-0 ml-2">
                    <h3 className={`text-sm font-medium truncate ${currentSessionId === session.id ? 'text-islamic-800' : 'text-gray-700'}`}>
                      {session.title}
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {new Date(session.createdAt).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  
                  <button
                    onClick={(e) => onDeleteSession(session.id, e)}
                    className={`
                      p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all
                      md:opacity-0
                      ${/* Show delete button on mobile always or on hover */ ''}
                      opacity-100 md:group-hover:opacity-100
                    `}
                    title="حذف المحادثة"
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;