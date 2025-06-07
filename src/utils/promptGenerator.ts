
import { emotionMusicDatabase } from '../data/emotionDatabase';

export const generateMusicPrompt = (params: any) => {
  const {
    selectedEmotion,
    formData,
    lyrics,
    detectedEmotions,
    aiSuggestions
  } = params;

  // Get display values from form data
  const emotion = selectedEmotion || 'mixed';
  const subEmotion = getDisplayValue('subEmotion', formData.subEmotion) || 'Various';
  const mood = getDisplayValue('mood', formData.mood) || 'Dynamic';
  const vocalType = getDisplayValue('vocalType', formData.vocalType) || 'Versatile';
  const singerStyle = getDisplayValue('singerStyle', formData.singerStyle) || 'Expressive';
  const genre1 = getDisplayValue('genre1', formData.genre1) || 'Contemporary';
  const genre2 = getDisplayValue('genre2', formData.genre2) || 'Fusion';
  const style = getDisplayValue('genre3', formData.genre3) || 'Modern';
  const language = getDisplayValue('language', formData.language) || 'English';
  const era = getDisplayValue('era', formData.era) || 'Contemporary';
  const tempo = getDisplayValue('tempo', formData.tempo) || 'Medium';

  // Create the music prompt
  let prompt = createIntelligentPrompt({
    emotion, subEmotion, mood, vocalType, singerStyle,
    genre1, genre2, style, language, era, tempo,
    lyrics, 
    emotionIntensity: formData.emotionIntensity,
    genreFusion: formData.genreFusion,
    commercial: formData.commercial,
    detectedEmotions, 
    aiSuggestions
  });

  // Create metadata
  const metadata = createMetadata({
    emotion, mood, vocalType, genre1, genre2, 
    language, era, tempo, detectedEmotions
  });

  // Dispatch event to show output
  window.dispatchEvent(new CustomEvent('showOutput', { 
    detail: { prompt, metadata } 
  }));

  return { prompt, metadata };
};

const getDisplayValue = (field: string, value: string) => {
  if (!value) return '';
  
  // Convert kebab-case back to title case for display
  return value.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const createIntelligentPrompt = (params: any) => {
  let prompt = '';
  
  // Opening with emotion and style
  prompt += `[${params.emotion.toUpperCase()} - ${params.subEmotion}] `;
  prompt += `${params.genre1} x ${params.genre2} fusion with ${params.style} elements. `;
  
  // Mood and atmosphere
  prompt += `${params.mood} atmosphere with ${params.emotionIntensity}% emotional intensity. `;
  
  // Vocal specifications
  prompt += `${params.vocalType} featuring ${params.singerStyle.toLowerCase()} vocal delivery`;
  if (params.language !== 'English') {
    prompt += ` in ${params.language}`;
  }
  prompt += '. ';
  
  // Tempo and rhythm
  prompt += `${params.tempo} tempo creating `;
  
  // Add emotion-specific descriptions
  const emotionDescriptions = {
    joy: "infectious energy that makes listeners want to dance and celebrate",
    love: "intimate connection that touches the heart deeply",
    sadness: "cathartic release through melodic sorrow",
    hope: "uplifting journey from darkness to light",
    empowerment: "unstoppable force of confidence and strength",
    yearning: "aching beauty of unfulfilled desire",
    reflection: "contemplative space for introspection",
    defiance: "rebellious energy challenging the status quo",
    passion: "sensual atmosphere of intense romantic connection",
    nostalgia: "bittersweet journey through cherished memories"
  };
  
  prompt += (emotionDescriptions[params.emotion] || "powerful emotional experience") + '. ';
  
  // Era and production style
  if (params.era !== 'Contemporary') {
    prompt += `${params.era} production aesthetics with modern polish. `;
  }
  
  // Genre fusion details
  if (params.genreFusion > 60) {
    prompt += `Bold ${params.genreFusion}% genre fusion creating unexpected sonic combinations. `;
  }
  
  // Commercial vs experimental
  if (params.commercial > 70) {
    prompt += "Radio-ready production with mass appeal. ";
  } else if (params.commercial < 30) {
    prompt += "Experimental approach pushing creative boundaries. ";
  }

  // Add AI-detected emotions if available
  if (params.detectedEmotions && params.detectedEmotions.length > 0) {
    prompt += `\n\nAI-Detected Emotions: `;
    params.detectedEmotions.forEach((emotion, index) => {
      prompt += `${emotion.emotion} (${emotion.confidence}%)`;
      if (index < params.detectedEmotions.length - 1) prompt += ', ';
    });
    prompt += '.';
  }

  // Add lyrics analysis if available
  if (params.lyrics) {
    prompt += `\n\nLyrics Theme: Capturing the essence of "${params.lyrics.substring(0, 100)}${params.lyrics.length > 100 ? '...' : ''}"`;
  }

  return prompt;
};

const createMetadata = (params: any) => {
  return `
    <div class="space-y-2">
      <span class="inline-block mr-5 text-purple-700"><strong>Emotion:</strong> ${params.emotion}</span>
      <span class="inline-block mr-5 text-purple-700"><strong>Mood:</strong> ${params.mood}</span>
      <span class="inline-block mr-5 text-purple-700"><strong>Vocals:</strong> ${params.vocalType}</span>
      <span class="inline-block mr-5 text-purple-700"><strong>Genres:</strong> ${params.genre1} + ${params.genre2}</span>
      <span class="inline-block mr-5 text-purple-700"><strong>Language:</strong> ${params.language}</span>
      <span class="inline-block mr-5 text-purple-700"><strong>Era:</strong> ${params.era}</span>
      <span class="inline-block mr-5 text-purple-700"><strong>Tempo:</strong> ${params.tempo}</span>
    </div>
  `;
};
