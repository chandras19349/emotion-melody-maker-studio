
import React from 'react';
import { generateMusicPrompt } from '../utils/promptGenerator';

interface ButtonGroupProps {
  onAnalyze: () => void;
  onRandomize: () => void;
  selectedEmotion: string | null;
  formData: any;
  lyrics: string;
  detectedEmotions: any[];
  aiSuggestions: any[];
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  onAnalyze,
  onRandomize,
  selectedEmotion,
  formData,
  lyrics,
  detectedEmotions,
  aiSuggestions
}) => {
  const handleGenerate = () => {
    const prompt = generateMusicPrompt({
      selectedEmotion,
      formData,
      lyrics,
      detectedEmotions,
      aiSuggestions
    });
    
    // Dispatch custom event to show output panel
    window.dispatchEvent(new CustomEvent('showOutput', { detail: prompt }));
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <button
        onClick={onAnalyze}
        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wide transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/30"
      >
        🤖 AI Analyze & Suggest
      </button>
      
      <button
        onClick={handleGenerate}
        className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wide transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-600/30"
      >
        🎼 Generate Music Prompt
      </button>
      
      <button
        onClick={onRandomize}
        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wide transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/30"
      >
        🎲 Random Style
      </button>
    </div>
  );
};

export default ButtonGroup;
