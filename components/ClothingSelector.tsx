import React from 'react';
import { Clothing } from '../types';

interface ClothingSelectorProps {
  items: Clothing[];
  selectedItems: Record<string, Clothing>;
  onSelect: (item: Clothing) => void;
}

const ClothingSelector: React.FC<ClothingSelectorProps> = ({ items, selectedItems, onSelect }) => {
  if (items.length === 0) {
    return <p className="text-slate-400 text-center mt-4">No items in this category.</p>;
  }

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg border border-blue-900 shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-blue-300 border-b border-blue-800 pb-2">Select Item</h2>
      <div className="grid grid-cols-2 gap-4">
        {items.map(item => (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
              selectedItems[item.id] ? 'border-blue-500 scale-105 shadow-blue-500/50 shadow-md' : 'border-slate-700 hover:border-blue-600'
            }`}
          >
            <div className="bg-slate-700 p-2 aspect-square flex items-center justify-center">
                <img src={item.src} alt={item.name} className="max-w-full max-h-full object-contain" />
            </div>
            <p className="text-center bg-slate-900 text-sm py-2 px-1 truncate">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClothingSelector;
