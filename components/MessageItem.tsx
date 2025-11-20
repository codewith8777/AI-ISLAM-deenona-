import React from 'react';
import { Message } from '../types';
import { UserIcon, AIIcon, BookIcon } from './Icons';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-start flex-row-reverse' : 'justify-start'}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ml-3 ${isUser ? 'bg-islamic-600 text-white mr-3 ml-0' : 'bg-islamic-100 text-islamic-700'}`}>
        {isUser ? <UserIcon /> : <AIIcon />}
      </div>

      {/* Content Bubble */}
      <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-5 py-3.5 rounded-2xl shadow-sm text-base leading-7 whitespace-pre-wrap ${
            isUser 
              ? 'bg-islamic-600 text-white rounded-tr-none' 
              : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
          }`}
        >
            {message.text}
        </div>

        {/* Sources Section (Only for AI) */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-3 w-full">
            <h4 className="text-xs font-bold text-islamic-600 mb-2 flex items-center gap-1">
              <BookIcon />
              المصادر والمراجع:
            </h4>
            <div className="flex flex-wrap gap-2">
              {message.sources.map((source, idx) => (
                <a 
                  key={idx}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-islamic-200 text-islamic-700 text-xs hover:bg-islamic-50 hover:border-islamic-300 transition-colors shadow-sm"
                >
                  <span className="truncate max-w-[150px]">{source.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}
        
        {/* Timestamp/Error */}
        <div className="mt-1 flex items-center gap-2">
            <span className="text-[10px] text-gray-400">
                {new Date(message.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
            </span>
            {message.isError && <span className="text-[10px] text-red-500">فشل الإرسال</span>}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;