import React, { useState, useEffect } from 'react';
import EmotionAnalyzer from './EmotionAnalyzer';
import EmotionWheel from './EmotionWheel';
import ControlsGrid from './ControlsGrid';
import AISuggestions from './AISuggestions';
import AdvancedOptions from './AdvancedOptions';
import ButtonGroup from './ButtonGroup';
import { emotionMusicDatabase } from '../data/emotionDatabase';
import { analyzeEmotions, generateAISuggestions } from '../utils/aiAnalysis';

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

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
    // Update form options based on selected emotion
    updateFormOptions(emotion);
  };

  const updateFormOptions = (emotion) => {
    if (emotionMusicDatabase[emotion]) {
      // Reset form data when emotion changes
      setFormData(prev => ({
        ...prev,
        subEmotion: '',
        mood: '',
        genre1: '',
        genre2: '',
        genre3: ''
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
      
      <ControlsGrid
        selectedEmotion={selectedEmotion}
        formData={formData}
        setFormData={setFormData}
        lyrics={lyrics}
        setLyrics={setLyrics}
      />
      
      <AISuggestions
        suggestions={aiSuggestions}
        onApplySuggestion={handleApplySuggestion}
      />
      
      <AdvancedOptions
        formData={formData}
        setFormData={setFormData}
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
