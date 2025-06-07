
import React from 'react';
import { emotionCategories } from '../data/emotionCategories';

interface EmotionWheelProps {
  selectedEmotion: string | null;
  onEmotionSelect: (emotion: string) => void;
}

const EmotionWheel: React.FC<EmotionWheelProps> = ({ selectedEmotion, onEmotionSelect }) => {
  return (
    <div className="bg-yellow-50 rounded-2xl p-6 mb-8">
      <h4 className="text-yellow-800 text-lg font-semibold mb-4">
        Select Primary Emotion Group
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {emotionCategories.map((category) => (
          <div
            key={category.id}
            className={`bg-white p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:border-red-400 hover:scale-105 ${
              selectedEmotion === category.id
                ? 'bg-yellow-400 text-white border-red-400 scale-105'
                : 'border-yellow-400'
            }`}
            onClick={() => onEmotionSelect(category.id)}
          >
            <h5 className={`font-semibold mb-1 ${selectedEmotion === category.id ? 'text-white' : ''}`}>
              {category.title}
            </h5>
            <p className={`text-sm ${selectedEmotion === category.id ? 'text-white opacity-90' : 'opacity-80'}`}>
              {category.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmotionWheel;
