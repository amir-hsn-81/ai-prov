
import React, { useState, useCallback, useRef } from 'react';
import { ClothingCategory } from '../types';
import CameraFeed from './CameraFeed';
import { mergeClothingItem } from '../services/geminiService';

const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const ShirtIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path></svg>;
const PantsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v7.5a2.5 2.5 0 0 1-5 0V2"></path><path d="M12 2v7.5a2.5 2.5 0 0 0 5 0V2"></path><path d="M3 10c0 1.5 1.8 3 4 3s4-1.5 4-3"></path><path d="M13 10c0 1.5 1.8 3 4 3s4-1.5 4-3"></path><path d="M3 10v10c0 .6.4 1 1 1h4c.6 0 1-.4 1-1V10"></path><path d="M15 10v10c0 .6.4 1 1 1h4c.6 0 1-.4 1-1V10"></path></svg>;
const ShoesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 16 4-7 4 .5-6 6.5A4.5 4.5 0 1 0 8.5 22H12h.5a4.5 4.5 0 1 0 4-10.8V10c0-4.4-3.6-8-8-8S2 5.6 2 10v6Z"></path><path d="M12 11.2V22"></path></svg>;
const HairIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 11s2-2 5-2 5 2 5 2"></path><path d="M12 11s2-2 5-2 5 2 5 2"></path><path d="M3 5s2 2 5 2 5-2 5-2"></path><path d="M12 5s2 2 5 2 5-2 5-2"></path><path d="M13 22s-2-2-5-2-5 2-5 2"></path><path d="M12 22s2-2 5-2 5 2 5 2"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const CaptureIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 16 16"><path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 1A5 5 0 1 1 8 3a5 5 0 0 1 0 10z"/><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14z"/></svg>;
const UndoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></svg>;
const ResetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M21 21v-5h-5"></path></svg>;
const LoadingSpinner = () => <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-300"></div>;

const CATEGORIES: { name: ClothingCategory; icon: React.ReactElement }[] = [
  { name: 'shirt', icon: <ShirtIcon /> },
  { name: 'pants', icon: <PantsIcon /> },
  { name: 'shoes', icon: <ShoesIcon /> },
  { name: 'hair', icon: <HairIcon /> },
];

interface FittingRoomScreenProps {
  userImage: string;
  onBack: () => void;
}

const FittingRoomScreen: React.FC<FittingRoomScreenProps> = ({ userImage, onBack }) => {
  const [history, setHistory] = useState<string[]>([userImage]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<ClothingCategory | null>(null);
  const [showItemCamera, setShowItemCamera] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const currentImage = history[history.length - 1];

  const handleMergeItem = useCallback(async (itemImageSrc: string, category: ClothingCategory) => {
    setIsLoading(true);
    setError(null);
    setShowItemCamera(false);
    setEditingCategory(null);
    
    try {
      const newImage = await mergeClothingItem(currentImage, itemImageSrc, category);
      setHistory(prev => [...prev, newImage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred while merging the item.');
    } finally {
      setIsLoading(false);
    }
  }, [currentImage]);

  const handleCategoryClick = (category: ClothingCategory) => {
    setEditingCategory(category);
  };
  
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleItemFromCamera = () => {
    setShowItemCamera(true);
  };

  const handleCapture = useCallback(() => {
    if (!videoRef.current || !editingCategory) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageSrc = canvas.toDataURL('image/png');
    handleMergeItem(imageSrc, editingCategory);
  }, [editingCategory, handleMergeItem]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingCategory) return;
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          handleMergeItem(e.target.result, editingCategory);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUndo = () => {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const handleReset = () => {
    setHistory([userImage]);
  };
  
  const ItemCameraView = () => (
      <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black animate-fade-in">
        <CameraFeed videoRef={videoRef} />
        <button onClick={() => { setShowItemCamera(false); setEditingCategory(null); }} className="absolute top-4 left-4 z-10 bg-black/50 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-transform transform hover:scale-105">
          <BackIcon /> Back
        </button>
        <button onClick={handleCapture} className="absolute bottom-8 z-10 bg-blue-600/80 p-4 rounded-full flex items-center justify-center transition-transform transform hover:scale-110 ring-4 ring-blue-600/50">
          <CaptureIcon />
        </button>
      </div>
  );
  
  const ItemSourceModal = () => (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center animate-fade-in p-4" onClick={() => setEditingCategory(null)}>
          <div className="bg-slate-800 p-8 rounded-lg shadow-xl shadow-blue-500/20 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <h3 className="text-2xl font-bold text-blue-300 mb-6 text-center capitalize">Add {editingCategory}</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={handleItemFromCamera} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105">
                      <CameraIcon /> Use Camera
                  </button>
                  <button onClick={triggerFileUpload} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105">
                      <UploadIcon /> Upload Photo
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>
          </div>
      </div>
  );

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row animate-fade-in bg-slate-900">
      <aside className="w-full lg:w-80 bg-slate-800 p-4 flex flex-col border-b-2 lg:border-b-0 lg:border-r-2 border-blue-900">
        <button onClick={onBack} className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-transform transform hover:scale-105 mb-6">
          <BackIcon /> Back to Selection
        </button>
        <h2 className="text-xl font-bold text-blue-300 border-b border-blue-800 pb-2 mb-4">Add Items</h2>
        <div className="grid grid-cols-2 gap-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              disabled={isLoading}
              className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-lg transition-colors duration-200 flex flex-col items-center justify-center aspect-square disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cat.icon}
              <span className="text-sm font-semibold capitalize mt-2">{cat.name}</span>
            </button>
          ))}
        </div>
        <div className="mt-auto pt-4 border-t border-blue-800 flex flex-col gap-2">
           <button onClick={handleUndo} disabled={history.length <= 1 || isLoading} className="w-full flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <UndoIcon /> Undo Last Item
            </button>
           <button onClick={handleReset} disabled={history.length <= 1 || isLoading} className="w-full flex items-center justify-center bg-rose-800 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <ResetIcon /> Reset All
            </button>
        </div>
      </aside>
      <main className="flex-grow relative flex items-center justify-center bg-black/50 p-4" style={{ minHeight: 'calc(100vh - 250px)' }}>
        <div className="relative w-auto h-[90vh] aspect-[9/16] max-w-full max-h-full rounded-lg overflow-hidden shadow-2xl shadow-blue-500/20 bg-slate-900">
          <img src={currentImage} alt="User" className="w-full h-full object-contain" />
           {isLoading && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center p-4 z-10 backdrop-blur-sm">
                <LoadingSpinner />
                <p className="text-blue-200 text-lg font-semibold mt-4">AI Stylist is at work...</p>
                <p className="text-slate-400 mt-1">Merging your new look.</p>
            </div>
           )}
           {error && (
            <div className="absolute bottom-4 left-4 right-4 bg-red-500/90 text-white p-3 rounded-lg shadow-lg z-10">
                <p className="font-bold">An Error Occurred</p>
                <p className="text-sm">{error}</p>
            </div>
           )}
        </div>
      </main>
      
      {editingCategory && <ItemSourceModal />}
      {showItemCamera && <ItemCameraView />}
    </div>
  );
};

export default FittingRoomScreen;
