
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

  // Create the structured music prompt
  let prompt = createStructuredPrompt({
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

const createStructuredPrompt = (params: any) => {
  const tempoMap = {
    'slow': '60-90 BPM',
    'medium': '90-120 BPM', 
    'upbeat': '120-140 BPM',
    'fast': '140-180 BPM',
    'variable': 'Variable tempo'
  };

  const keyMap = {
    'joy': 'C major with bright progressions',
    'love': 'G major with romantic chord substitutions',
    'sadness': 'D minor with melancholic progressions',
    'hope': 'F major with uplifting modulations',
    'empowerment': 'E major with powerful chord movements',
    'yearning': 'A minor with longing progressions',
    'reflection': 'G major with contemplative changes',
    'defiance': 'B minor with aggressive progressions',
    'passion': 'A major with sensual chord flows',
    'nostalgia': 'F major with bittersweet progressions'
  };

  const structureMap = {
    'joy': 'Intro-Verse-Chorus-Verse-Chorus-Bridge-Double Chorus-Outro',
    'love': 'Intro-Verse-Chorus-Verse-Chorus-Bridge-Final Chorus-Outro',
    'sadness': 'Intro-Verse-Chorus-Verse-Chorus-Instrumental-Final Chorus',
    'empowerment': 'Intro-Verse-Pre-Chorus-Chorus-Verse-Pre-Chorus-Chorus-Bridge-Final Chorus',
    'default': 'Intro-Verse-Chorus-Verse-Chorus-Bridge-Final Chorus-Outro'
  };

  const vocalCharacteristics = {
    'male lead': 'rich baritone with emotional depth',
    'female lead': 'expressive soprano with dynamic range',
    'duet': 'harmonized male-female interplay',
    'group vocals': 'layered harmonies with call-response elements'
  };

  const instrumentationMap = {
    'pop': 'synthesizers, electric guitar, bass, programmed drums',
    'rock': 'electric guitars, bass guitar, live drums, occasional keys',
    'ballad': 'piano foundation, strings, acoustic guitar, soft percussion',
    'dance': 'electronic beats, synthesizers, bass drops, vocal chops',
    'folk': 'acoustic guitar, harmonica, light percussion, string accents'
  };

  // Build structured prompt with character limit awareness
  let prompt = '';
  
  // Style section (80-100 chars)
  prompt += `[Style: ${params.genre1} ${params.genre2}, ${params.subEmotion.toLowerCase()} with ${params.mood.toLowerCase()} undertones] `;
  
  // Vocals section (80-120 chars)
  const vocalChar = vocalCharacteristics[params.vocalType.toLowerCase()] || 'expressive delivery';
  prompt += `[Vocals: ${params.vocalType}, ${params.singerStyle.toLowerCase()}, ${vocalChar}] `;
  
  // Instrumentation section (80-120 chars)
  const instruments = instrumentationMap[params.genre1.toLowerCase()] || 'dynamic instrumental arrangement';
  prompt += `[Instrumentation: ${instruments}] `;
  
  // Tempo section (40-60 chars)
  const tempoDesc = tempoMap[params.tempo.toLowerCase()] || params.tempo;
  prompt += `[Tempo: ${tempoDesc}] `;
  
  // Mood section (60-80 chars)
  prompt += `[Mood: ${params.mood}, ${params.emotion} atmosphere] `;
  
  // Key section (60-80 chars)
  const keyInfo = keyMap[params.emotion] || 'C major with versatile progressions';
  prompt += `[Key: ${keyInfo}] `;
  
  // Structure section (60-80 chars)
  const structure = structureMap[params.emotion] || structureMap.default;
  prompt += `[Structure: ${structure}] `;
  
  // Pacing section (80-120 chars)
  const intensityDesc = params.emotionIntensity > 70 ? 'high energy dynamics' : 
                       params.emotionIntensity > 40 ? 'moderate build-ups' : 'subtle dynamic changes';
  prompt += `[Pacing: ${intensityDesc}, ${params.era.toLowerCase()} production style]`;
  
  // Ensure under 990 characters
  if (prompt.length > 990) {
    prompt = prompt.substring(0, 987) + '...';
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
