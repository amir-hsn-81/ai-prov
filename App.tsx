import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import ImageSourceScreen from './components/ImageSourceScreen';
import FittingRoomScreen from './components/FittingRoomScreen';

export default function App() {
  const [step, setStep] = useState<'welcome' | 'image_source' | 'fitting'>('welcome');
  const [userImage, setUserImage] = useState<string | null>(null);

  const handleStart = () => setStep('image_source');
  
  const handleImageReady = (image: string) => {
    setUserImage(image);
    setStep('fitting');
  };
  
  const handleBackToImageSource = () => {
    setUserImage(null);
    setStep('image_source');
  };

  const handleBackToWelcome = () => setStep('welcome');

  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return <WelcomeScreen onStart={handleStart} />;
      case 'image_source':
        return <ImageSourceScreen onImageReady={handleImageReady} onBack={handleBackToWelcome} />;
      case 'fitting':
        if (!userImage) {
          handleBackToImageSource();
          return null;
        }
        return <FittingRoomScreen userImage={userImage} onBack={handleBackToImageSource} />;
      default:
        return <WelcomeScreen onStart={handleStart} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {renderStep()}
    </div>
  );
}
