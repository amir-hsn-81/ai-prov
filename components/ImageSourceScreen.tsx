import React, { useState, useRef, useCallback } from 'react';
import CameraFeed from './CameraFeed';

const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const CaptureIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 16 16"><path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 1A5 5 0 1 1 8 3a5 5 0 0 1 0 10z"/><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14z"/></svg>;


interface ImageSourceScreenProps {
  onImageReady: (image: string) => void;
  onBack: () => void;
}

const ImageSourceScreen: React.FC<ImageSourceScreenProps> = ({ onImageReady, onBack }) => {
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = useCallback(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    onImageReady(canvas.toDataURL('image/jpeg'));
  }, [onImageReady]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          onImageReady(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  if (showCamera) {
    return (
      <div className="relative w-full h-screen flex flex-col items-center justify-center bg-black animate-fade-in">
        <CameraFeed videoRef={videoRef} />
        <button onClick={() => setShowCamera(false)} className="absolute top-4 left-4 z-10 bg-black/50 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-transform transform hover:scale-105">
          <BackIcon /> Back
        </button>
        <button onClick={handleCapture} className="absolute bottom-8 z-10 bg-blue-600/80 p-4 rounded-full flex items-center justify-center transition-transform transform hover:scale-110 ring-4 ring-blue-600/50">
          <CaptureIcon />
        </button>
      </div>
    );
  }

  return (
     <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in">
        <button onClick={onBack} className="absolute top-4 left-4 z-10 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-transform transform hover:scale-105">
            <BackIcon /> Back
        </button>
        <div className="text-center max-w-2xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-400 mb-4">Choose Your Model</h2>
            <p className="text-slate-300 mb-8">
                Use your live camera for a real-time experience or upload a high-quality photo from your gallery.
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
                <button onClick={() => setShowCamera(true)} className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105">
                    <CameraIcon /> Use Camera
                </button>
                <button onClick={triggerFileUpload} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105">
                    <UploadIcon /> Upload Photo
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
        </div>
     </div>
  );
};

export default ImageSourceScreen;
