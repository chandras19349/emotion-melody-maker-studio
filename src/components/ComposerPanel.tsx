import React, { useState, useEffect } from 'react';
import EmotionAnalyzer from './EmotionAnalyzer';
import EmotionWheel from './EmotionWheel';
import ControlsGrid from './ControlsGrid';
import AISuggestions from './AISuggestions';
import AIInsights from './AIInsights';
import AdvancedOptions from './AdvancedOptions';
import ButtonGroup from './ButtonGroup';
import { emotionMusicDatabase } from '../data/emotionDatabase';
import { analyzeEmotions, generateAISuggestions } from '../utils/aiAnalysis';
import { aiPromptGenerator } from '../utils/aiMusicGenerator';

const ComposerPanel = () => {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [detectedEmotions, setDetectedEmotions] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lyrics, setLyrics] = useState('');
  const [formData, setFormData] = useState({
    subEmotion: '',
    mood: '',
    vocalType: '',
    singerStyle: '',
    genre1: '',
    genre2: '',
    genre3: '',
    language: 'english',
    era: 'contemporary',
    tempo: 'medium',
    emotionIntensity: 70,
    genreFusion: 50,
    commercial: 50
  });

  // AI Auto-generation when emotion or key fields change
  useEffect(() => {
    if (selectedEmotion) {
      generateAIRecommendationsAuto();
    }
  }, [selectedEmotion]);

  // AI Auto-generation when lyrics change (debounced)
  useEffect(() => {
    if (lyrics.length > 20) {
      const timeoutId = setTimeout(() => {
        generateAIRecommendationsAuto();
      }, 1000); // 1 second debounce
      
      return () => clearTimeout(timeoutId);
    }
  }, [lyrics]);

  const generateAIRecommendationsAuto = () => {
    if (!selectedEmotion && lyrics.length < 20) return;
    
    // Generate AI insights automatically
    const recommendation = aiPromptGenerator.generateIntelligentRecommendations({
      selectedEmotion,
      formData,
      lyrics
    });
    
    // Auto-apply high-confidence recommendations
    if (recommendation.confidence > 0.7) {
      applyAIRecommendations(recommendation.suggestions, false);
    }
  };

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
    // Update form options based on selected emotion
    updateFormOptions(emotion);
    
    // Generate AI recommendations immediately
    setTimeout(() => {
      generateAIRecommendationsAuto();
    }, 100);
  };

  const updateFormOptions = (emotion) => {
    if (emotionMusicDatabase[emotion]) {
      // Reset form data when emotion changes, but keep user's explicit choices
      setFormData(prev => ({
        ...prev,
        // Only reset if not explicitly set by user
        subEmotion: prev.subEmotion || '',
        mood: prev.mood || '',
        genre1: prev.genre1 || '',
        genre2: prev.genre2 || '',
        genre3: prev.genre3 || ''
      }));
    }
  };

  const handleAnalyze = async () => {
    if (!lyrics.trim()) {
      alert('Please enter some lyrics for AI analysis!');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const emotions = analyzeEmotions(lyrics);
      const suggestions = generateAISuggestions(emotions, lyrics);
      
      setDetectedEmotions(emotions);
      setAiSuggestions(suggestions);
      setIsAnalyzing(false);
      
      // Auto-select the top detected emotion if none selected
      if (!selectedEmotion && emotions.length > 0) {
        setSelectedEmotion(emotions[0].emotion);
      }
    }, 1500);
  };

  const handleApplySuggestion = (suggestion) => {
    setSelectedEmotion(suggestion.emotion);
    setFormData(prev => ({
      ...prev,
      subEmotion: suggestion.subEmotion.toLowerCase().replace(/\s+/g, '-'),
      mood: suggestion.mood.toLowerCase(),
      vocalType: suggestion.vocalType.toLowerCase().replace(/\s+/g, '-'),
      singerStyle: suggestion.singerStyle.toLowerCase(),
      genre1: suggestion.genre1.toLowerCase().replace(/\s+/g, '-'),
      genre2: suggestion.genre2.toLowerCase().replace(/\s+/g, '-'),
      genre3: suggestion.style.toLowerCase().replace(/\s+/g, '-')
    }));
  };

  const applyAIRecommendations = (recommendations, showNotification = true) => {
    const updates = {};
    
    // Convert AI recommendations to form format
    Object.entries(recommendations).forEach(([key, value]) => {
      if (value) {
        const kebabValue = String(value).toLowerCase().replace(/\s+/g, '-');
        
        switch (key) {
          case 'subEmotion':
            updates.subEmotion = kebabValue;
            break;
          case 'mood':
            updates.mood = kebabValue;
            break;
          case 'vocalType':
            updates.vocalType = kebabValue;
            break;
          case 'singerStyle':
            updates.singerStyle = kebabValue;
            break;
          case 'genre1':
            updates.genre1 = kebabValue;
            break;
          case 'genre2':
            updates.genre2 = kebabValue;
            break;
          case 'tempo':
            updates.tempo = kebabValue;
            break;
          case 'era':
            updates.era = kebabValue;
            break;
        }
      }
    });
    
    setFormData(prev => ({ ...prev, ...updates }));
    
    if (showNotification) {
      // Show a brief notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-slideIn';
      notification.textContent = 'AI recommendations applied!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    }
  };

  const handleRandomize = () => {
    const emotions = Object.keys(emotionMusicDatabase);
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const emotionData = emotionMusicDatabase[randomEmotion];
    
    setSelectedEmotion(randomEmotion);
    setFormData({
      subEmotion: emotionData.subEmotions[Math.floor(Math.random() * emotionData.subEmotions.length)].toLowerCase().replace(/\s+/g, '-'),
      mood: emotionData.moods[Math.floor(Math.random() * emotionData.moods.length)].toLowerCase(),
      vocalType: ['male-lead', 'female-lead', 'duet', 'group-male'][Math.floor(Math.random() * 4)],
      singerStyle: ['smooth', 'powerful', 'soulful'][Math.floor(Math.random() * 3)],
      genre1: emotionData.genres.primary[Math.floor(Math.random() * emotionData.genres.primary.length)].toLowerCase().replace(/\s+/g, '-'),
      genre2: emotionData.genres.secondary[Math.floor(Math.random() * emotionData.genres.secondary.length)].toLowerCase().replace(/\s+/g, '-'),
      genre3: emotionData.genres.styles[Math.floor(Math.random() * emotionData.genres.styles.length)].toLowerCase().replace(/\s+/g, '-'),
      language: 'english',
      era: 'contemporary',
      tempo: 'medium',
      emotionIntensity: Math.floor(Math.random() * 100),
      genreFusion: Math.floor(Math.random() * 100),
      commercial: Math.floor(Math.random() * 100)
    });
  };

  const handleFormDataChange = (newFormData) => {
    setFormData(newFormData);
    
    // Trigger AI analysis when significant changes are made
    if (selectedEmotion || lyrics.length > 10) {
      setTimeout(() => {
        generateAIRecommendationsAuto();
      }, 500);
    }
  };

  return (
    <div className="bg-white/95 rounded-3xl shadow-2xl p-10 mb-8">
      <EmotionAnalyzer
        isAnalyzing={isAnalyzing}
        detectedEmotions={detectedEmotions}
        onAnalyze={handleAnalyze}
      />
      
      <EmotionWheel
        selectedEmotion={selectedEmotion}
        onEmotionSelect={handleEmotionSelect}
      />
      
      {/* AI Insights Component - New intelligent AI panel */}
      <AIInsights
        selectedEmotion={selectedEmotion}
        formData={formData}
        lyrics={lyrics}
        onApplyAIRecommendations={applyAIRecommendations}
      />
      
      <ControlsGrid
        selectedEmotion={selectedEmotion}
        formData={formData}
        setFormData={handleFormDataChange}
        lyrics={lyrics}
        setLyrics={setLyrics}
      />
      
      <AISuggestions
        suggestions={aiSuggestions}
        onApplySuggestion={handleApplySuggestion}
      />
      
      <AdvancedOptions
        formData={formData}
        setFormData={handleFormDataChange}
      />
      
      <ButtonGroup
        onAnalyze={handleAnalyze}
        onRandomize={handleRandomize}
        selectedEmotion={selectedEmotion}
        formData={formData}
        lyrics={lyrics}
        detectedEmotions={detectedEmotions}
        aiSuggestions={aiSuggestions}
      />
    </div>
  );
};

export default ComposerPanel;