
import { emotionMusicDatabase } from '../data/emotionDatabase';

export const analyzeEmotions = (lyrics: string) => {
  const lyricsLower = lyrics.toLowerCase();
  const detectedEmotions = [];
  
  // Check each emotion category
  for (const [emotion, data] of Object.entries(emotionMusicDatabase)) {
    let confidence = 0;
    let matchedKeywords = [];
    
    // Check keywords
    data.keywords.forEach(keyword => {
      if (lyricsLower.includes(keyword)) {
        confidence += 20;
        matchedKeywords.push(keyword);
      }
    });
    
    // Additional pattern matching
    if (emotion === 'love' && /heart|soul|forever|always/.test(lyricsLower)) {
      confidence += 15;
    }
    if (emotion === 'sadness' && /alone|lost|broken|goodbye/.test(lyricsLower)) {
      confidence += 15;
    }
    if (emotion === 'joy' && /dance|celebrate|smile|laugh/.test(lyricsLower)) {
      confidence += 15;
    }
    
    if (confidence > 0) {
      detectedEmotions.push({
        emotion: emotion,
        confidence: Math.min(confidence, 95),
        keywords: matchedKeywords
      });
    }
  }
  
  // Sort by confidence
  detectedEmotions.sort((a, b) => b.confidence - a.confidence);
  
  return detectedEmotions.slice(0, 3); // Return top 3 emotions
};

export const generateAISuggestions = (emotions: any[], lyrics: string) => {
  const suggestions = [];
  
  emotions.forEach(emotion => {
    const emotionData = emotionMusicDatabase[emotion.emotion];
    if (emotionData) {
      // Create suggestion based on emotion
      const suggestion = {
        emotion: emotion.emotion,
        confidence: emotion.confidence,
        subEmotion: emotionData.subEmotions[Math.floor(Math.random() * emotionData.subEmotions.length)],
        mood: emotionData.moods[Math.floor(Math.random() * 3)],
        vocalType: emotionData.vocalTypes[Math.floor(Math.random() * emotionData.vocalTypes.length)],
        singerStyle: emotionData.singerStyles[Math.floor(Math.random() * emotionData.singerStyles.length)],
        genre1: emotionData.genres.primary[Math.floor(Math.random() * 3)],
        genre2: emotionData.genres.secondary[Math.floor(Math.random() * 2)],
        style: emotionData.genres.styles[Math.floor(Math.random() * 2)]
      };
      
      suggestions.push(suggestion);
    }
  });
  
  return suggestions;
};
