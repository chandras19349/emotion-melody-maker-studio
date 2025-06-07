
import React from 'react';

interface EmotionAnalyzerProps {
  isAnalyzing: boolean;
  detectedEmotions: any[];
  onAnalyze: () => void;
}

const EmotionAnalyzer: React.FC<EmotionAnalyzerProps> = ({
  isAnalyzing,
  detectedEmotions,
  onAnalyze
}) => {
  return (
    <div className="bg-blue-50 border-2 border-purple-600 rounded-2xl p-6 mb-8">
      <h3 className="text-purple-600 text-xl font-semibold mb-4">
        🤖 AI Emotion Analysis
      </h3>
      <p className="mb-4">
        Enter lyrics below and AI will analyze emotions and suggest matching music styles
      </p>
      
      {isAnalyzing && (
        <div className="text-center py-5">
          <div className="inline-block w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-2"></div>
          <p>Analyzing emotions...</p>
        </div>
      )}
      
      <div className="flex flex-wrap gap-3 mt-4">
        {detectedEmotions.map((emotion, index) => (
          <div
            key={index}
            className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 animate-fadeIn"
          >
            {emotion.emotion.charAt(0).toUpperCase() + emotion.emotion.slice(1)}
            <span className="bg-white/30 px-2 py-1 rounded-full text-xs">
              {emotion.confidence}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmotionAnalyzer;
