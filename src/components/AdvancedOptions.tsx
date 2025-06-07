
import React from 'react';

interface AdvancedOptionsProps {
  formData: any;
  setFormData: (data: any) => void;
}

const AdvancedOptions: React.FC<AdvancedOptionsProps> = ({ formData, setFormData }) => {
  const handleSliderChange = (field: string, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-yellow-50 rounded-2xl p-6 mb-8">
      <h3 className="text-yellow-800 text-lg font-semibold mb-4">
        Advanced AI Parameters
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="flex justify-between items-center mb-2">
            <span>Emotion Intensity:</span>
            <span className="font-bold text-purple-600">{formData.emotionIntensity}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={formData.emotionIntensity}
            onChange={(e) => handleSliderChange('emotionIntensity', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
        
        <div>
          <label className="flex justify-between items-center mb-2">
            <span>Genre Fusion Level:</span>
            <span className="font-bold text-purple-600">{formData.genreFusion}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={formData.genreFusion}
            onChange={(e) => handleSliderChange('genreFusion', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
        
        <div>
          <label className="flex justify-between items-center mb-2">
            <span>Commercial vs Experimental:</span>
            <span className="font-bold text-purple-600">{formData.commercial}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={formData.commercial}
            onChange={(e) => handleSliderChange('commercial', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>
    </div>
  );
};

export default AdvancedOptions;
