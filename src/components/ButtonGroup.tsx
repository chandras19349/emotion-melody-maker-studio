import React from 'react';
import { generateMusicPrompt } from '../utils/promptGenerator';
import { aiPromptGenerator } from '../utils/aiMusicGenerator';
import { Brain, Zap, Shuffle, Music } from 'lucide-react';

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

  const handleAIGenerate = () => {
    // Generate AI-enhanced prompt
    const aiPrompt = aiPromptGenerator.generateAutoPrompt({
      selectedEmotion,
      formData,
      lyrics,
      detectedEmotions,
      aiSuggestions
    });
    
    // Get AI insights for metadata
    const aiRecommendation = aiPromptGenerator.generateIntelligentRecommendations({
      selectedEmotion,
      formData,
      lyrics
    });
    
    const metadata = `
      <div class="bg-gradient-to-r from-purple-100 to-indigo-100 p-4 rounded-lg mb-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-purple-700 font-semibold">🤖 AI-Enhanced Generation</span>
          <span class="bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs">
            ${Math.round(aiRecommendation.confidence * 100)}% Confidence
          </span>
        </div>
        <p class="text-purple-600 text-sm">${aiRecommendation.reasoning}</p>
      </div>
    `;
    
    window.dispatchEvent(new CustomEvent('showOutput', { 
      detail: { prompt: aiPrompt, metadata } 
    }));
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <button
        onClick={onAnalyze}
        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wide transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/30 flex items-center gap-2"
      >
        <Brain className="w-5 h-5" />
        🤖 AI Analyze & Suggest
      </button>
      
      <button
        onClick={handleAIGenerate}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wide transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-600/30 flex items-center gap-2"
      >
        <Zap className="w-5 h-5" />
        🚀 AI Smart Generate
      </button>
      
      <button
        onClick={handleGenerate}
        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wide transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-600/30 flex items-center gap-2"
      >
        <Music className="w-5 h-5" />
        🎼 Generate Prompt
      </button>
      
      <button
        onClick={onRandomize}
        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wide transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/30 flex items-center gap-2"
      >
        <Shuffle className="w-5 h-5" />
        🎲 Random Style
      </button>
    </div>
  );
};

export default ButtonGroup;