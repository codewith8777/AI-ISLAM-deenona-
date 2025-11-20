import React, { useState, useRef, useEffect } from 'react';
import { SendIcon } from './Icons';

interface InputAreaProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  return (
    <div className="w-full bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 md:pb-6 z-20">
      <div className="max-w-4xl mx-auto">
        <form 
          onSubmit={handleSubmit}
          className="relative flex items-end gap-2 bg-gray-50 border border-gray-300 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-islamic-400 focus-within:border-transparent transition-all shadow-sm"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="اسأل عن حكم شرعي، تفسير آية، أو معلومة إسلامية..."
            className="w-full bg-transparent border-none focus:ring-0 resize-none py-3 px-3 max-h-[150px] text-gray-700 placeholder-gray-400 text-base"
            rows={1}
            disabled={isLoading}
            dir="rtl"
          />
          
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-xl flex-shrink-0 transition-all duration-200 ${
              input.trim() && !isLoading
                ? 'bg-islamic-600 text-white shadow-md hover:bg-islamic-700 transform hover:-translate-y-0.5'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Send Message"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <SendIcon />
            )}
          </button>
        </form>
        <div className="text-center mt-2">
            <p className="text-[10px] text-gray-400">الذكاء الاصطناعي قد يخطئ. يرجى مراجعة المصادر المرفقة للتأكد.</p>
        </div>
      </div>
    </div>
  );
};

export default InputArea;