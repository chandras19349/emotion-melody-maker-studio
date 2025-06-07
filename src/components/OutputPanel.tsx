
import React, { useState, useEffect } from 'react';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

const OutputPanel = () => {
  const [prompt, setPrompt] = useState('');
  const [metadata, setMetadata] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleShowOutput = (event: any) => {
      setPrompt(event.detail.prompt);
      setMetadata(event.detail.metadata);
      setIsVisible(true);
    };

    window.addEventListener('showOutput', handleShowOutput);
    return () => window.removeEventListener('showOutput', handleShowOutput);
  }, []);

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast.success('Prompt copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy prompt');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="bg-white/95 rounded-3xl p-10 shadow-2xl animate-slideIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Your AI-Generated Music Composition
        </h2>
        <button
          onClick={copyPrompt}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wide transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/30 flex items-center gap-2"
        >
          <Copy size={20} />
          Copy
        </button>
      </div>
      
      {metadata && (
        <div className="bg-indigo-50 rounded-xl p-4 mb-6 text-sm">
          <div dangerouslySetInnerHTML={{ __html: metadata }} />
        </div>
      )}
      
      <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 font-serif leading-relaxed text-gray-800 whitespace-pre-wrap mb-4">
        {prompt}
      </div>
      
      <div className="text-sm text-gray-600 text-right">
        {prompt.length} characters
      </div>
    </div>
  );
};

export default OutputPanel;
