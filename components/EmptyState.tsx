import React from 'react';
import { BookIcon } from './Icons';

interface EmptyStateProps {
  onSelectPrompt: (prompt: string) => void;
}

const SUGGESTIONS = [
  "ما هو فضل صلاة الضحى؟",
  "حكم قصر الصلاة للمسافر",
  "أذكار الصباح والمساء الصحيحة",
  "تفسير سورة الإخلاص"
];

const EmptyState: React.FC<EmptyStateProps> = ({ onSelectPrompt }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 py-10 fade-in">
      <div className="w-20 h-20 bg-islamic-50 rounded-full flex items-center justify-center mb-6 animate-pulse-slow">
        <BookIcon />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2 font-serif">مرحباً بك في البيان</h2>
      <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
        مساعدك الإسلامي الذكي للإجابة على الأسئلة الشرعية. أستمد معلوماتي من المصادر الموثوقة مثل إسلام ويب وابن باز.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
        {SUGGESTIONS.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelectPrompt(suggestion)}
            className="text-right p-4 rounded-xl border border-gray-200 bg-white hover:border-islamic-300 hover:bg-islamic-50 hover:shadow-md transition-all duration-200 text-sm text-gray-700"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;