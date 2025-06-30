import { emotionMusicDatabase } from '../data/emotionDatabase';
import { aiPromptGenerator } from './aiMusicGenerator';

export const generateMusicPrompt = (params: any) => {
  const {
    selectedEmotion,
    formData,
    lyrics,
    detectedEmotions,
    aiSuggestions
  } = params;

  // Use AI-enhanced prompt generation
  const aiPrompt = aiPromptGenerator.generateAutoPrompt({
    selectedEmotion,
    formData,
    lyrics,
    detectedEmotions,
    aiSuggestions
  });

  // Create metadata with AI insights
  const metadata = createEnhancedMetadata({
    selectedEmotion, 
    formData, 
    lyrics,
    detectedEmotions,
    aiSuggestions
  });

  // Dispatch event to show output
  window.dispatchEvent(new CustomEvent('showOutput', { 
    detail: { prompt: aiPrompt, metadata } 
  }));

  return { prompt: aiPrompt, metadata };
};

const getDisplayValue = (field: string, value: string) => {
  if (!value) return '';
  
  // Convert kebab-case back to title case for display
  return value.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const createEnhancedMetadata = (params: any) => {
  const { selectedEmotion, formData, lyrics, detectedEmotions, aiSuggestions } = params;
  
  // Generate AI confidence score
  const aiRecommendation = aiPromptGenerator.generateIntelligentRecommendations(params);
  const confidence = Math.round(aiRecommendation.confidence * 100);
  
  let metadata = `<div class="space-y-3">`;
  
  // AI Confidence indicator
  metadata += `<div class="bg-gradient-to-r from-purple-100 to-indigo-100 p-3 rounded-lg">`;
  metadata += `<span class="text-purple-700 font-semibold">🤖 AI Confidence: ${confidence}%</span>`;
  if (confidence > 80) {
    metadata += ` <span class="text-green-600 text-sm">(Excellent Match)</span>`;
  } else if (confidence > 60) {
    metadata += ` <span class="text-blue-600 text-sm">(Good Match)</span>`;
  } else {
    metadata += ` <span class="text-yellow-600 text-sm">(Fair Match)</span>`;
  }
  metadata += `</div>`;
  
  // Core parameters
  metadata += `<div class="grid grid-cols-2 gap-2">`;
  metadata += `<span class="text-purple-700"><strong>Emotion:</strong> ${selectedEmotion || 'Mixed'}</span>`;
  metadata += `<span class="text-purple-700"><strong>Mood:</strong> ${getDisplayValue('mood', formData.mood) || 'Dynamic'}</span>`;
  metadata += `<span class="text-purple-700"><strong>Vocals:</strong> ${getDisplayValue('vocalType', formData.vocalType) || 'Versatile'}</span>`;
  metadata += `<span class="text-purple-700"><strong>Style:</strong> ${getDisplayValue('singerStyle', formData.singerStyle) || 'Expressive'}</span>`;
  metadata += `<span class="text-purple-700"><strong>Primary Genre:</strong> ${getDisplayValue('genre1', formData.genre1) || 'Contemporary'}</span>`;
  metadata += `<span class="text-purple-700"><strong>Secondary Genre:</strong> ${getDisplayValue('genre2', formData.genre2) || 'Fusion'}</span>`;
  metadata += `<span class="text-purple-700"><strong>Language:</strong> ${getDisplayValue('language', formData.language) || 'English'}</span>`;
  metadata += `<span class="text-purple-700"><strong>Era:</strong> ${getDisplayValue('era', formData.era) || 'Contemporary'}</span>`;
  metadata += `<span class="text-purple-700"><strong>Tempo:</strong> ${getDisplayValue('tempo', formData.tempo) || 'Medium'}</span>`;
  metadata += `<span class="text-purple-700"><strong>Intensity:</strong> ${formData.emotionIntensity || 70}%</span>`;
  metadata += `</div>`;
  
  // Detected emotions if available
  if (detectedEmotions && detectedEmotions.length > 0) {
    metadata += `<div class="bg-green-50 p-3 rounded-lg">`;
    metadata += `<span class="text-green-700 font-semibold">🎯 Detected Emotions: </span>`;
    metadata += detectedEmotions.map(e => 
      `<span class="inline-block bg-green-200 text-green-800 px-2 py-1 rounded text-xs mr-1">${e.emotion} (${e.confidence}%)</span>`
    ).join('');
    metadata += `</div>`;
  }
  
  // AI reasoning if available
  if (aiRecommendation.reasoning) {
    metadata += `<div class="bg-blue-50 p-3 rounded-lg">`;
    metadata += `<span class="text-blue-700 font-semibold">💡 AI Reasoning: </span>`;
    metadata += `<span class="text-blue-600 text-sm">${aiRecommendation.reasoning}</span>`;
    metadata += `</div>`;
  }
  
  // Lyrics analysis if available
  if (lyrics && lyrics.length > 20) {
    const wordCount = lyrics.split(' ').length;
    metadata += `<div class="bg-yellow-50 p-3 rounded-lg">`;
    metadata += `<span class="text-yellow-700 font-semibold">📝 Lyrics Analysis: </span>`;
    metadata += `<span class="text-yellow-600 text-sm">${wordCount} words analyzed for emotional context</span>`;
    metadata += `</div>`;
  }
  
  metadata += `</div>`;
  
  return metadata;
};