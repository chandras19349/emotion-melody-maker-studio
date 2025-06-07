
import React from 'react';
import { emotionMusicDatabase } from '../data/emotionDatabase';
import { vocalTypes, singerStyles, languages, eras, tempos } from '../data/musicOptions';

interface ControlsGridProps {
  selectedEmotion: string | null;
  formData: any;
  setFormData: (data: any) => void;
  lyrics: string;
  setLyrics: (lyrics: string) => void;
}

const ControlsGrid: React.FC<ControlsGridProps> = ({
  selectedEmotion,
  formData,
  setFormData,
  lyrics,
  setLyrics
}) => {
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getEmotionOptions = (type: string) => {
    if (!selectedEmotion || !emotionMusicDatabase[selectedEmotion]) return [];
    
    switch (type) {
      case 'subEmotions':
        return emotionMusicDatabase[selectedEmotion].subEmotions || [];
      case 'moods':
        return emotionMusicDatabase[selectedEmotion].moods || [];
      case 'primaryGenres':
        return emotionMusicDatabase[selectedEmotion].genres?.primary || [];
      case 'secondaryGenres':
        return emotionMusicDatabase[selectedEmotion].genres?.secondary || [];
      case 'styles':
        return emotionMusicDatabase[selectedEmotion].genres?.styles || [];
      default:
        return [];
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div className="flex flex-col">
        <label className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wide">
          Sub-Emotion
        </label>
        <select
          value={formData.subEmotion}
          onChange={(e) => handleInputChange('subEmotion', e.target.value)}
          className="p-3 border-2 border-gray-300 rounded-lg text-base transition-all duration-300 hover:border-purple-600 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100"
        >
          <option value="">-- Select after choosing emotion --</option>
          {getEmotionOptions('subEmotions').map((emotion, index) => (
            <option key={index} value={emotion.toLowerCase().replace(/\s+/g, '-')}>
              {emotion}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wide">
          Mood
        </label>
        <select
          value={formData.mood}
          onChange={(e) => handleInputChange('mood', e.target.value)}
          className="p-3 border-2 border-gray-300 rounded-lg text-base transition-all duration-300 hover:border-purple-600 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100"
        >
          <option value="">-- Auto-detected from lyrics --</option>
          {getEmotionOptions('moods').map((mood, index) => (
            <option key={index} value={mood.toLowerCase()}>
              {mood}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wide">
          Vocal Type
        </label>
        <select
          value={formData.vocalType}
          onChange={(e) => handleInputChange('vocalType', e.target.value)}
          className="p-3 border-2 border-gray-300 rounded-lg text-base transition-all duration-300 hover:border-purple-600 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100"
        >
          <option value="">-- Select Vocal Type --</option>
          {vocalTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wide">
          Singer Style
        </label>
        <select
          value={formData.singerStyle}
          onChange={(e) => handleInputChange('singerStyle', e.target.value)}
          className="p-3 border-2 border-gray-300 rounded-lg text-base transition-all duration-300 hover:border-purple-600 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100"
        >
          <option value="">-- Select Singer Style --</option>
          {singerStyles.map((style) => (
            <option key={style.value} value={style.value}>
              {style.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wide">
          Primary Music Genre
        </label>
        <select
          value={formData.genre1}
          onChange={(e) => handleInputChange('genre1', e.target.value)}
          className="p-3 border-2 border-gray-300 rounded-lg text-base transition-all duration-300 hover:border-purple-600 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100"
        >
          <option value="">-- AI will suggest --</option>
          {getEmotionOptions('primaryGenres').map((genre, index) => (
            <option key={index} value={genre.toLowerCase().replace(/\s+/g, '-')}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wide">
          Secondary Music Genre
        </label>
        <select
          value={formData.genre2}
          onChange={(e) => handleInputChange('genre2', e.target.value)}
          className="p-3 border-2 border-gray-300 rounded-lg text-base transition-all duration-300 hover:border-purple-600 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100"
        >
          <option value="">-- AI will suggest --</option>
          {getEmotionOptions('secondaryGenres').map((genre, index) => (
            <option key={index} value={genre.toLowerCase().replace(/\s+/g, '-')}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wide">
          Language
        </label>
        <select
          value={formData.language}
          onChange={(e) => handleInputChange('language', e.target.value)}
          className="p-3 border-2 border-gray-300 rounded-lg text-base transition-all duration-300 hover:border-purple-600 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100"
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wide">
          Era/Period Style
        </label>
        <select
          value={formData.era}
          onChange={(e) => handleInputChange('era', e.target.value)}
          className="p-3 border-2 border-gray-300 rounded-lg text-base transition-all duration-300 hover:border-purple-600 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100"
        >
          {eras.map((era) => (
            <option key={era.value} value={era.value}>
              {era.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wide">
          Tempo
        </label>
        <select
          value={formData.tempo}
          onChange={(e) => handleInputChange('tempo', e.target.value)}
          className="p-3 border-2 border-gray-300 rounded-lg text-base transition-all duration-300 hover:border-purple-600 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100"
        >
          {tempos.map((tempo) => (
            <option key={tempo.value} value={tempo.value}>
              {tempo.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col md:col-span-2 lg:col-span-3">
        <label className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wide">
          Song Lyrics (AI will analyze emotions and suggest matching styles)
        </label>
        <textarea
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          placeholder="Enter lyrics in any language...&#10;Example: 'My heart beats for you, every moment feels new...'&#10;AI will detect emotions like love, joy, sadness, etc. and suggest appropriate music styles"
          className="p-3 border-2 border-gray-300 rounded-lg text-base transition-all duration-300 hover:border-purple-600 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100 min-h-32 resize-y"
        />
        <div className="text-sm text-gray-600 mt-1 text-right">
          {lyrics.length} characters
        </div>
      </div>
    </div>
  );
};

export default ControlsGrid;
