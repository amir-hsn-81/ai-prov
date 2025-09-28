
import React, { useState } from 'react';
import { getStyleAdvice } from '../services/geminiService';

interface StyleAdvisorModalProps {
  snapshot: string;
  onClose: () => void;
}

const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-300"></div>
);

const StyleAdvisorModal: React.FC<StyleAdvisorModalProps> = ({ snapshot, onClose }) => {
  const [prompt, setPrompt] = useState('این لباس به من می آید؟ نظرت چیست؟');
  const [advice, setAdvice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetAdvice = async () => {
    if (!prompt.trim()) {
        setError('لطفاً سوال خود را بنویسید.');
        return;
    }
    setIsLoading(true);
    setError('');
    setAdvice('');
    try {
      const result = await getStyleAdvice(snapshot, prompt);
      setAdvice(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'یک خطای ناشناخته رخ داد.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-2xl shadow-blue-500/30 w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="w-full md:w-1/2 p-4 border-b md:border-b-0 md:border-r border-slate-700">
            <img src={snapshot} alt="Snapshot" className="w-full h-full object-contain rounded-md" />
        </div>
        <div className="w-full md:w-1/2 p-6 flex flex-col">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">مشاوره استایل با هوش مصنوعی</h2>
            <div className="flex-grow overflow-y-auto pr-2">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-300">
                        <LoadingSpinner />
                        <p className="mt-4">...در حال تحلیل استایل شما</p>
                    </div>
                ) : advice ? (
                    <div className="bg-slate-900 p-4 rounded-md whitespace-pre-wrap text-slate-200">
                        {advice}
                    </div>
                ) : (
                    <>
                        <p className="text-slate-300 mb-4">از دستیار هوش مصنوعی ما در مورد این لباس سوال بپرسید.</p>
                        <textarea
                            className="w-full p-3 bg-slate-900 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </>
                )}
                 {error && <p className="text-red-400 mt-4">{error}</p>}
            </div>
            <div className="mt-6 flex gap-4">
                <button
                    onClick={handleGetAdvice}
                    disabled={isLoading || !!advice}
                    className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'صبر کنید...' : 'دریافت مشاوره'}
                </button>
                <button
                    onClick={onClose}
                    className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                    بستن
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StyleAdvisorModal;
