import { emotionMusicDatabase } from '../data/emotionDatabase';

interface AIGenerationParams {
  selectedEmotion?: string;
  formData: any;
  lyrics?: string;
  detectedEmotions?: any[];
  aiSuggestions?: any[];
}

interface AIRecommendation {
  confidence: number;
  reasoning: string;
  suggestions: {
    subEmotion?: string;
    mood?: string;
    vocalType?: string;
    singerStyle?: string;
    genre1?: string;
    genre2?: string;
    tempo?: string;
    era?: string;
  };
}

export class AIPromptGenerator {
  private emotionWeights = {
    joy: { energy: 0.9, positivity: 0.95, complexity: 0.6 },
    love: { energy: 0.7, positivity: 0.8, complexity: 0.8 },
    sadness: { energy: 0.3, positivity: 0.2, complexity: 0.9 },
    hope: { energy: 0.6, positivity: 0.85, complexity: 0.7 },
    empowerment: { energy: 0.95, positivity: 0.9, complexity: 0.7 },
    yearning: { energy: 0.5, positivity: 0.4, complexity: 0.85 },
    reflection: { energy: 0.4, positivity: 0.6, complexity: 0.9 },
    defiance: { energy: 0.9, positivity: 0.3, complexity: 0.6 },
    passion: { energy: 0.8, positivity: 0.7, complexity: 0.8 },
    nostalgia: { energy: 0.4, positivity: 0.5, complexity: 0.8 }
  };

  generateIntelligentRecommendations(params: AIGenerationParams): AIRecommendation {
    const { selectedEmotion, formData, lyrics } = params;
    
    // Analyze current context
    const emotionAnalysis = this.analyzeEmotionalContext(selectedEmotion, lyrics);
    const styleAnalysis = this.analyzeStylePreferences(formData);
    const coherenceScore = this.calculateCoherenceScore(emotionAnalysis, styleAnalysis);
    
    // Generate AI recommendations
    const recommendations = this.generateRecommendations(emotionAnalysis, styleAnalysis, coherenceScore);
    
    return {
      confidence: coherenceScore,
      reasoning: this.generateReasoning(emotionAnalysis, recommendations),
      suggestions: recommendations
    };
  }

  private analyzeEmotionalContext(emotion?: string, lyrics?: string) {
    if (!emotion) return { primary: 'neutral', intensity: 0.5, complexity: 0.5 };
    
    const emotionData = emotionMusicDatabase[emotion];
    if (!emotionData) return { primary: emotion, intensity: 0.5, complexity: 0.5 };
    
    const weights = this.emotionWeights[emotion] || { energy: 0.5, positivity: 0.5, complexity: 0.5 };
    
    // Analyze lyrics if provided
    let lyricsInfluence = 0.5;
    if (lyrics && lyrics.length > 20) {
      lyricsInfluence = this.analyzeLyricsIntensity(lyrics, emotion);
    }
    
    return {
      primary: emotion,
      intensity: (weights.energy + lyricsInfluence) / 2,
      positivity: weights.positivity,
      complexity: weights.complexity,
      energy: weights.energy
    };
  }

  private analyzeLyricsIntensity(lyrics: string, emotion: string): number {
    const lyricsLower = lyrics.toLowerCase();
    const intensityWords = {
      high: ['always', 'never', 'forever', 'completely', 'absolutely', 'totally', 'deeply'],
      medium: ['really', 'very', 'quite', 'pretty', 'fairly', 'rather'],
      low: ['maybe', 'perhaps', 'sometimes', 'occasionally', 'slightly']
    };
    
    let intensity = 0.5;
    
    intensityWords.high.forEach(word => {
      if (lyricsLower.includes(word)) intensity += 0.1;
    });
    
    intensityWords.medium.forEach(word => {
      if (lyricsLower.includes(word)) intensity += 0.05;
    });
    
    intensityWords.low.forEach(word => {
      if (lyricsLower.includes(word)) intensity -= 0.05;
    });
    
    return Math.max(0.1, Math.min(1.0, intensity));
  }

  private analyzeStylePreferences(formData: any) {
    const preferences = {
      modernityScore: this.calculateModernityScore(formData.era, formData.genre1, formData.genre2),
      energyLevel: this.calculateEnergyLevel(formData.tempo, formData.vocalType),
      complexityLevel: this.calculateComplexityLevel(formData.genre1, formData.genre2, formData.singerStyle),
      commercialScore: formData.commercial || 50
    };
    
    return preferences;
  }

  private calculateModernityScore(era?: string, genre1?: string, genre2?: string): number {
    const modernityMap = {
      'contemporary': 1.0,
      '2010s': 0.9,
      '2000s': 0.7,
      '90s': 0.5,
      '80s': 0.3,
      '70s': 0.2,
      '60s': 0.1,
      'classic': 0.1
    };
    
    let score = era ? (modernityMap[era] || 0.5) : 0.5;
    
    // Adjust based on genres
    const modernGenres = ['edm', 'electronic', 'trap', 'future-bass', 'synthwave'];
    if (genre1 && modernGenres.some(g => genre1.toLowerCase().includes(g))) score += 0.2;
    if (genre2 && modernGenres.some(g => genre2.toLowerCase().includes(g))) score += 0.1;
    
    return Math.min(1.0, score);
  }

  private calculateEnergyLevel(tempo?: string, vocalType?: string): number {
    const tempoMap = {
      'slow': 0.2,
      'medium': 0.5,
      'upbeat': 0.8,
      'fast': 1.0,
      'variable': 0.6
    };
    
    const vocalEnergyMap = {
      'rap': 0.9,
      'group-male': 0.8,
      'group-female': 0.8,
      'mixed-group': 0.9,
      'male-lead': 0.6,
      'female-lead': 0.6,
      'duet': 0.7
    };
    
    const tempoScore = tempo ? (tempoMap[tempo] || 0.5) : 0.5;
    const vocalScore = vocalType ? (vocalEnergyMap[vocalType] || 0.5) : 0.5;
    
    return (tempoScore + vocalScore) / 2;
  }

  private calculateComplexityLevel(genre1?: string, genre2?: string, singerStyle?: string): number {
    const complexGenres = ['jazz', 'classical', 'progressive', 'fusion', 'experimental'];
    const simpleGenres = ['pop', 'dance', 'disco', 'punk'];
    
    let complexity = 0.5;
    
    if (genre1) {
      if (complexGenres.some(g => genre1.toLowerCase().includes(g))) complexity += 0.3;
      if (simpleGenres.some(g => genre1.toLowerCase().includes(g))) complexity -= 0.2;
    }
    
    if (genre2) {
      if (complexGenres.some(g => genre2.toLowerCase().includes(g))) complexity += 0.2;
      if (simpleGenres.some(g => genre2.toLowerCase().includes(g))) complexity -= 0.1;
    }
    
    const complexStyles = ['operatic', 'classical', 'ethereal'];
    if (singerStyle && complexStyles.includes(singerStyle)) complexity += 0.2;
    
    return Math.max(0.1, Math.min(1.0, complexity));
  }

  private calculateCoherenceScore(emotionAnalysis: any, styleAnalysis: any): number {
    // Check if style choices align with emotional context
    let coherence = 0.7; // Base score
    
    // Energy alignment
    const energyDiff = Math.abs(emotionAnalysis.energy - styleAnalysis.energyLevel);
    coherence -= energyDiff * 0.3;
    
    // Complexity alignment
    const complexityDiff = Math.abs(emotionAnalysis.complexity - styleAnalysis.complexityLevel);
    coherence -= complexityDiff * 0.2;
    
    // Commercial vs artistic alignment
    if (styleAnalysis.commercialScore > 70 && emotionAnalysis.complexity > 0.8) {
      coherence -= 0.1; // Complex emotions might not align with commercial approach
    }
    
    return Math.max(0.3, Math.min(1.0, coherence));
  }

  private generateRecommendations(emotionAnalysis: any, styleAnalysis: any, coherenceScore: number) {
    const emotion = emotionAnalysis.primary;
    const emotionData = emotionMusicDatabase[emotion];
    
    if (!emotionData) return {};
    
    const recommendations: any = {};
    
    // Smart sub-emotion selection
    if (emotionData.subEmotions) {
      const intensityIndex = Math.floor(emotionAnalysis.intensity * emotionData.subEmotions.length);
      recommendations.subEmotion = emotionData.subEmotions[Math.min(intensityIndex, emotionData.subEmotions.length - 1)];
    }
    
    // Smart mood selection
    if (emotionData.moods) {
      const positivityIndex = Math.floor(emotionAnalysis.positivity * emotionData.moods.length);
      recommendations.mood = emotionData.moods[Math.min(positivityIndex, emotionData.moods.length - 1)];
    }
    
    // Smart genre selection based on energy and modernity
    if (emotionData.genres) {
      const primaryGenres = emotionData.genres.primary || [];
      const secondaryGenres = emotionData.genres.secondary || [];
      
      // Select primary genre based on energy level
      if (styleAnalysis.energyLevel > 0.7) {
        recommendations.genre1 = primaryGenres.find(g => 
          ['rock', 'dance', 'electronic', 'hip hop'].some(energetic => 
            g.toLowerCase().includes(energetic)
          )
        ) || primaryGenres[0];
      } else if (styleAnalysis.energyLevel < 0.4) {
        recommendations.genre1 = primaryGenres.find(g => 
          ['ballad', 'acoustic', 'folk', 'classical'].some(calm => 
            g.toLowerCase().includes(calm)
          )
        ) || primaryGenres[0];
      } else {
        recommendations.genre1 = primaryGenres[Math.floor(primaryGenres.length / 2)];
      }
      
      // Select secondary genre for fusion
      recommendations.genre2 = secondaryGenres[Math.floor(Math.random() * secondaryGenres.length)];
    }
    
    // Smart vocal type selection
    if (emotionAnalysis.intensity > 0.8) {
      recommendations.vocalType = 'Group Vocals';
    } else if (emotionAnalysis.complexity > 0.7) {
      recommendations.vocalType = 'Duet';
    } else {
      recommendations.vocalType = Math.random() > 0.5 ? 'Male Lead' : 'Female Lead';
    }
    
    // Smart tempo selection
    if (styleAnalysis.energyLevel > 0.8) {
      recommendations.tempo = 'Fast';
    } else if (styleAnalysis.energyLevel > 0.6) {
      recommendations.tempo = 'Upbeat';
    } else if (styleAnalysis.energyLevel < 0.3) {
      recommendations.tempo = 'Slow';
    } else {
      recommendations.tempo = 'Medium';
    }
    
    return recommendations;
  }

  private generateReasoning(emotionAnalysis: any, recommendations: any): string {
    const emotion = emotionAnalysis.primary;
    const intensity = emotionAnalysis.intensity;
    const energy = emotionAnalysis.energy;
    
    let reasoning = `Based on the ${emotion} emotion with ${intensity > 0.7 ? 'high' : intensity > 0.4 ? 'moderate' : 'low'} intensity, `;
    
    if (recommendations.genre1) {
      reasoning += `I recommend ${recommendations.genre1} as the primary genre because it aligns with the ${energy > 0.7 ? 'energetic' : energy > 0.4 ? 'balanced' : 'contemplative'} nature of this emotion. `;
    }
    
    if (recommendations.tempo) {
      reasoning += `The ${recommendations.tempo.toLowerCase()} tempo will enhance the emotional impact. `;
    }
    
    if (recommendations.vocalType) {
      reasoning += `${recommendations.vocalType} vocals will best convey the emotional depth.`;
    }
    
    return reasoning;
  }

  generateAutoPrompt(params: AIGenerationParams): string {
    const aiRecommendation = this.generateIntelligentRecommendations(params);
    const { selectedEmotion, formData } = params;
    
    // Use AI recommendations to fill gaps in form data
    const enhancedFormData = {
      ...formData,
      subEmotion: formData.subEmotion || this.convertToKebabCase(aiRecommendation.suggestions.subEmotion),
      mood: formData.mood || this.convertToKebabCase(aiRecommendation.suggestions.mood),
      vocalType: formData.vocalType || this.convertToKebabCase(aiRecommendation.suggestions.vocalType),
      singerStyle: formData.singerStyle || this.convertToKebabCase(aiRecommendation.suggestions.singerStyle),
      genre1: formData.genre1 || this.convertToKebabCase(aiRecommendation.suggestions.genre1),
      genre2: formData.genre2 || this.convertToKebabCase(aiRecommendation.suggestions.genre2),
      tempo: formData.tempo || this.convertToKebabCase(aiRecommendation.suggestions.tempo),
      era: formData.era || this.convertToKebabCase(aiRecommendation.suggestions.era)
    };
    
    // Generate prompt using enhanced data
    return this.createIntelligentPrompt({
      ...params,
      formData: enhancedFormData,
      aiRecommendation
    });
  }

  private convertToKebabCase(text?: string): string {
    if (!text) return '';
    return text.toLowerCase().replace(/\s+/g, '-');
  }

  private createIntelligentPrompt(params: any): string {
    const { selectedEmotion, formData, aiRecommendation } = params;
    
    const emotion = selectedEmotion || 'mixed';
    const confidence = Math.round(aiRecommendation.confidence * 100);
    
    // Create a more intelligent, context-aware prompt
    let prompt = `[AI-Enhanced ${confidence}% Match] `;
    
    // Core style with AI reasoning
    prompt += `[Style: ${this.getDisplayValue(formData.genre1)} ${this.getDisplayValue(formData.genre2)}, `;
    prompt += `${this.getDisplayValue(formData.subEmotion)} with ${this.getDisplayValue(formData.mood)} undertones] `;
    
    // Intelligent vocal direction
    prompt += `[Vocals: ${this.getDisplayValue(formData.vocalType)}, ${this.getDisplayValue(formData.singerStyle)}, `;
    prompt += `emotionally ${emotion === 'sadness' ? 'vulnerable' : emotion === 'joy' ? 'uplifting' : 'expressive'}] `;
    
    // Smart instrumentation based on genre and emotion
    const instrumentation = this.getSmartInstrumentation(formData.genre1, formData.genre2, emotion);
    prompt += `[Instrumentation: ${instrumentation}] `;
    
    // Dynamic tempo with emotional context
    prompt += `[Tempo: ${this.getDisplayValue(formData.tempo)}, `;
    prompt += `${this.getTempoEmotionalContext(formData.tempo, emotion)}] `;
    
    // Mood with AI enhancement
    prompt += `[Mood: ${this.getDisplayValue(formData.mood)}, ${emotion} atmosphere, `;
    prompt += `${formData.emotionIntensity > 70 ? 'intense' : formData.emotionIntensity > 40 ? 'moderate' : 'subtle'} emotional depth] `;
    
    // Smart key and progression
    const keyInfo = this.getSmartKeyProgression(emotion, formData.genre1);
    prompt += `[Key: ${keyInfo}] `;
    
    // Intelligent structure
    const structure = this.getSmartStructure(emotion, formData.genre1, formData.tempo);
    prompt += `[Structure: ${structure}] `;
    
    // Production style with era context
    prompt += `[Production: ${this.getDisplayValue(formData.era)} style, `;
    prompt += `${formData.commercial > 70 ? 'radio-ready' : formData.commercial > 40 ? 'artistic-commercial balance' : 'experimental'} approach]`;
    
    return prompt.length > 990 ? prompt.substring(0, 987) + '...' : prompt;
  }

  private getDisplayValue(value?: string): string {
    if (!value) return 'Dynamic';
    return value.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  private getSmartInstrumentation(genre1?: string, genre2?: string, emotion?: string): string {
    const instrumentationMap = {
      'pop': 'layered synths, crisp drums, melodic bass',
      'rock': 'driving guitars, powerful drums, rhythmic bass',
      'ballad': 'piano foundation, string arrangements, gentle percussion',
      'electronic': 'synthesizers, programmed beats, atmospheric pads',
      'folk': 'acoustic guitar, organic percussion, harmonic textures',
      'jazz': 'sophisticated harmonies, improvised elements, rich textures',
      'hip-hop': 'heavy beats, bass-driven, rhythmic elements',
      'r&b': 'smooth bass lines, soulful arrangements, groove-focused'
    };
    
    const emotionalInstruments = {
      'sadness': 'melancholic strings, soft piano',
      'joy': 'bright brass, uplifting strings',
      'love': 'warm strings, intimate piano',
      'empowerment': 'powerful drums, soaring guitars',
      'yearning': 'ethereal pads, longing melodies'
    };
    
    let base = 'dynamic arrangement';
    if (genre1) {
      const key = Object.keys(instrumentationMap).find(k => 
        genre1.toLowerCase().includes(k)
      );
      if (key) base = instrumentationMap[key];
    }
    
    if (emotion && emotionalInstruments[emotion]) {
      base += `, ${emotionalInstruments[emotion]}`;
    }
    
    return base;
  }

  private getTempoEmotionalContext(tempo?: string, emotion?: string): string {
    const contexts = {
      'slow': emotion === 'sadness' ? 'contemplative pacing' : 'intimate feel',
      'medium': 'balanced groove',
      'upbeat': emotion === 'joy' ? 'celebratory energy' : 'driving momentum',
      'fast': 'high-energy dynamics'
    };
    
    return contexts[tempo || 'medium'] || 'dynamic pacing';
  }

  private getSmartKeyProgression(emotion?: string, genre?: string): string {
    const emotionalKeys = {
      'joy': 'C major with bright, uplifting progressions',
      'love': 'G major with romantic chord substitutions',
      'sadness': 'D minor with melancholic, descending progressions',
      'hope': 'F major with ascending, hopeful movements',
      'empowerment': 'E major with powerful, anthemic progressions',
      'yearning': 'A minor with longing, suspended chords',
      'passion': 'A major with sensual, flowing progressions'
    };
    
    return emotionalKeys[emotion || 'joy'] || 'versatile major key with dynamic progressions';
  }

  private getSmartStructure(emotion?: string, genre?: string, tempo?: string): string {
    const structures = {
      'joy': 'Intro-Verse-Chorus-Verse-Chorus-Bridge-Double Chorus-Outro',
      'love': 'Intro-Verse-Chorus-Verse-Chorus-Bridge-Final Chorus-Outro',
      'sadness': 'Intro-Verse-Chorus-Verse-Chorus-Instrumental-Final Chorus',
      'empowerment': 'Intro-Verse-Pre-Chorus-Chorus-Verse-Pre-Chorus-Chorus-Bridge-Final Chorus',
      'ballad': 'Intro-Verse-Chorus-Verse-Chorus-Bridge-Final Chorus-Outro'
    };
    
    if (genre?.toLowerCase().includes('ballad')) {
      return structures.ballad;
    }
    
    return structures[emotion || 'joy'] || 'Intro-Verse-Chorus-Verse-Chorus-Bridge-Final Chorus-Outro';
  }
}

// Export singleton instance
export const aiPromptGenerator = new AIPromptGenerator();