
import React, { useState } from 'react';

interface AISuggestionsProps {
  suggestions: any[];
  onApplySuggestion: (suggestion: any) => void;
}

const AISuggestions: React.FC<AISuggestionsProps> = ({ suggestions, onApplySuggestion }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (suggestions.length === 0) return null;

  return (
    <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6 mb-8 animate-slideIn">
      <h4 className="text-green-700 text-lg font-semibold mb-4">
        🎯 AI Style Recommendations
      </h4>
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className={`bg-white p-4 rounded-lg cursor-pointer transition-all duration-300 border-2 hover:border-green-500 hover:translate-x-1 ${
              selectedIndex === index ? 'bg-green-100 border-green-500' : 'border-transparent'
            }`}
            onClick={() => {
              setSelectedIndex(index);
              onApplySuggestion(suggestion);
            }}
          >
            <div className="font-bold text-green-800 mb-2">
              Suggestion {index + 1}: {suggestion.emotion.toUpperCase()} ({suggestion.confidence}% match)
            </div>
            <div className="text-sm text-gray-700 leading-relaxed">
              <strong>Sub-emotion:</strong> {suggestion.subEmotion}<br />
              <strong>Mood:</strong> {suggestion.mood}<br />
              <strong>Vocal Type:</strong> {suggestion.vocalType}<br />
              <strong>Singer Style:</strong> {suggestion.singerStyle}<br />
              <strong>Genres:</strong> {suggestion.genre1} + {suggestion.genre2}<br />
              <strong>Style:</strong> {suggestion.style}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AISuggestions;
