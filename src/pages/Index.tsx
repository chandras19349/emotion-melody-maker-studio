
import React from 'react';
import Header from '../components/Header';
import ComposerPanel from '../components/ComposerPanel';
import OutputPanel from '../components/OutputPanel';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-purple-900 p-5">
      <div className="max-w-7xl mx-auto">
        <Header />
        <ComposerPanel />
        <OutputPanel />
      </div>
    </div>
  );
};

export default Index;
