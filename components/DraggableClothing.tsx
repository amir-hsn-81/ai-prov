import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Clothing } from '../types';

interface DraggableClothingProps {
  item: Clothing;
  initialTransform: { x: number; y: number; width: number; rotation: number };
  onTransformChange: (id: string, newTransform: { x: number; y: number; width: number; rotation: number }) => void;
}

const RotateIcon = () => (
    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 4.55A8 8 0 006 14.9M9 15v5h5"></path></svg>
);
const ResizeIcon = () => (
    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4h4m12 0h-4v4m0 8v4h4M4 16h4v4"></path></svg>
);


const DraggableClothing: React.FC<DraggableClothingProps> = ({ item, initialTransform, onTransformChange }) => {
  const [transform, setTransform] = useState(initialTransform);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const [imgHeight, setImgHeight] = useState(0);

  useEffect(() => {
    const img = new Image();
    img.src = item.src;
    img.onload = () => {
      setImgHeight(transform.width * (img.height / img.width));
    }
  }, [item.src, transform.width]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    setIsDragging(true);
    startPos.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
  }, [transform]);

  const handleResizeStart = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    setIsResizing(true);
    startPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleRotateStart = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    setIsRotating(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newTransform = { ...transform, x: e.clientX - startPos.current.x, y: e.clientY - startPos.current.y };
      setTransform(newTransform);
      onTransformChange(item.id, newTransform);
    }
    if (isResizing && ref.current) {
        const dx = e.clientX - startPos.current.x;
        const newWidth = Math.max(50, transform.width + dx * 2); // Multiply by 2 for faster resizing
        const newTransform = { ...transform, width: newWidth };
        setTransform(newTransform);
        onTransformChange(item.id, newTransform);
        startPos.current = { x: e.clientX, y: e.clientY };
    }
    if (isRotating && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI) + 90; // +90 for better feel
      const newTransform = { ...transform, rotation: angle };
      setTransform(newTransform);
      onTransformChange(item.id, newTransform);
    }
  }, [isDragging, isResizing, isRotating, transform, onTransformChange, item.id]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={ref}
      className="absolute select-none cursor-move group"
      style={{
        left: `${transform.x}px`,
        top: `${transform.y}px`,
        width: `${transform.width}px`,
        height: `${imgHeight}px`,
        transform: `rotate(${transform.rotation}deg)`,
      }}
      onMouseDown={handleMouseDown}
    >
      <img src={item.src} alt={item.name} className="w-full h-full pointer-events-none" />
      <div className="absolute inset-0 border-2 border-dashed border-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div
        onMouseDown={handleResizeStart}
        className="absolute -bottom-2 -right-2 w-5 h-5 bg-blue-600 rounded-full cursor-se-resize flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-125"
      >
        <ResizeIcon/>
      </div>
      <div
        onMouseDown={handleRotateStart}
        className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 rounded-full cursor-alias flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-125"
      >
        <RotateIcon/>
      </div>
    </div>
  );
};

export default DraggableClothing;
