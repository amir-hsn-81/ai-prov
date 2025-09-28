import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center animate-fade-in">
      <div className="max-w-2xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <h1 className="text-5xl md:text-7xl font-bold text-blue-400 mb-4">
          Virtual Try-On Studio
        </h1>
        <p className="text-lg md:text-xl text-slate-300 mb-8">
          Create your new look. Select a photo of yourself and start styling with our virtual wardrobe.
        </p>
        <button
          onClick={onStart}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-blue-500/30 transition-all duration-300 transform hover:scale-110 active:scale-100"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
