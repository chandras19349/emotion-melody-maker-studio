import React, { useState, useEffect } from 'react';
import { aiPromptGenerator } from '../utils/aiMusicGenerator';
import { Brain, Lightbulb, TrendingUp, Zap } from 'lucide-react';

interface AIInsightsProps {
  selectedEmotion: string | null;
  formData: any;
  lyrics: string;
  onApplyAIRecommendations: (recommendations: any) => void;
}

const AIInsights: React.FC<AIInsightsProps> = ({
  selectedEmotion,
  formData,
  lyrics,
  onApplyAIRecommendations
}) => {
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autoMode, setAutoMode] = useState(true);

  useEffect(() => {
    if (selectedEmotion || lyrics.length > 10) {
      generateAIInsights();
    }
  }, [selectedEmotion, formData, lyrics]);

  const generateAIInsights = async () => {
    if (!selectedEmotion && lyrics.length < 10) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      const recommendation = aiPromptGenerator.generateIntelligentRecommendations({
        selectedEmotion,
        formData,
        lyrics
      });
      
      setAiRecommendation(recommendation);
      setIsAnalyzing(false);
      
      // Auto-apply if auto mode is enabled
      if (autoMode && recommendation.confidence > 0.6) {
        onApplyAIRecommendations(recommendation.suggestions);
      }
    }, 800);
  };

  const handleApplyRecommendations = () => {
    if (aiRecommendation?.suggestions) {
      onApplyAIRecommendations(aiRecommendation.suggestions);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.8) return 'text-green-600 bg-green-100';
    if (confidence > 0.6) return 'text-blue-600 bg-blue-100';
    if (confidence > 0.4) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence > 0.8) return 'Excellent Match';
    if (confidence > 0.6) return 'Good Match';
    if (confidence > 0.4) return 'Fair Match';
    return 'Needs Refinement';
  };

  if (!selectedEmotion && lyrics.length < 10) {
    return (
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 border-2 border-indigo-200">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-indigo-600" />
          <h3 className="text-indigo-800 text-lg font-semibold">
            🤖 AI Music Intelligence
          </h3>
        </div>
        <p className="text-indigo-700 mb-4">
          Select an emotion or enter lyrics to activate AI-powered music recommendations
        </p>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="autoMode"
            checked={autoMode}
            onChange={(e) => setAutoMode(e.target.checked)}
            className="rounded border-indigo-300"
          />
          <label htmlFor="autoMode" className="text-sm text-indigo-700">
            Auto-apply AI recommendations
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 border-2 border-indigo-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-indigo-600" />
          <h3 className="text-indigo-800 text-lg font-semibold">
            🤖 AI Music Intelligence
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="autoMode"
            checked={autoMode}
            onChange={(e) => setAutoMode(e.target.checked)}
            className="rounded border-indigo-300"
          />
          <label htmlFor="autoMode" className="text-sm text-indigo-700">
            Auto-apply
          </label>
        </div>
      </div>

      {isAnalyzing ? (
        <div className="text-center py-6">
          <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-indigo-700">AI analyzing your musical preferences...</p>
        </div>
      ) : aiRecommendation ? (
        <div className="space-y-4">
          {/* Confidence Score */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span className="font-medium text-indigo-800">AI Confidence:</span>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(aiRecommendation.confidence)}`}>
              {Math.round(aiRecommendation.confidence * 100)}% - {getConfidenceLabel(aiRecommendation.confidence)}
            </div>
          </div>

          {/* AI Reasoning */}
          <div className="bg-white/70 rounded-lg p-4">
            <div className="flex items-start gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
              <span className="font-medium text-gray-800">AI Reasoning:</span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {aiRecommendation.reasoning}
            </p>
          </div>

          {/* Recommendations */}
          {Object.keys(aiRecommendation.suggestions).length > 0 && (
            <div className="bg-white/70 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-800">Smart Recommendations:</span>
                </div>
                {!autoMode && (
                  <button
                    onClick={handleApplyRecommendations}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Apply All
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(aiRecommendation.suggestions).map(([key, value]) => (
                  value && (
                    <div key={key} className="bg-indigo-100 rounded-lg p-3">
                      <div className="text-xs font-medium text-indigo-600 uppercase tracking-wide mb-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-sm font-medium text-indigo-900">
                        {String(value)}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={generateAIInsights}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Brain className="w-4 h-4" />
              Re-analyze
            </button>
            
            <button
              onClick={() => {
                const autoPrompt = aiPromptGenerator.generateAutoPrompt({
                  selectedEmotion,
                  formData,
                  lyrics
                });
                
                window.dispatchEvent(new CustomEvent('showOutput', { 
                  detail: { 
                    prompt: autoPrompt,
                    metadata: `<div class="text-purple-700"><strong>AI-Generated Prompt</strong> - Confidence: ${Math.round(aiRecommendation.confidence * 100)}%</div>`
                  } 
                }));
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Generate AI Prompt
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AIInsights;