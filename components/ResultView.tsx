/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import Polaroid from './Polaroid';
import ChatInput from './ChatInput';

interface ResultViewProps {
  imageUrl: string;
  videoUrl: string | null;
  onReset: () => void;
  onEdit: (prompt: string) => void;
  onBringToLife: () => void;
  isRegenerating: boolean;
  editError: string | null;
  videoError: string | null;
}

const ResultView: React.FC<ResultViewProps> = ({ imageUrl, videoUrl, onReset, onEdit, onBringToLife, isRegenerating, editError, videoError }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const handleDownload = () => {
    const link = document.createElement('a');
    if (videoUrl) {
      link.href = videoUrl;
      link.download = 'glamour-shot-80s.mp4';
    } else {
      link.href = imageUrl;
      link.download = 'glamour-shot-80s.png';
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasVideo = !!videoUrl;

  return (
    <div className="w-full flex flex-col items-center animate-fade-in">
      <Polaroid 
        imageUrl={imageUrl} 
        videoUrl={videoUrl} 
        isRegenerating={isRegenerating}
        onClick={() => setIsPreviewOpen(true)}
      />

      {!hasVideo && (
        <div className="w-full max-w-lg mt-8">
          <ChatInput onPromptSubmit={onEdit} disabled={isRegenerating} />
          {editError && (
            <p className="text-red-500 text-center mt-2">{editError}</p>
          )}
        </div>
      )}

      {videoError && <p className="text-red-500 text-center mt-4">{videoError}</p>}

      <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={onReset}
          disabled={isRegenerating}
          className="bg-cyan-500 text-black py-3 px-8 border-2 border-cyan-300 hover:bg-cyan-400 active:bg-cyan-600 text-xl transform hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          START OVER
        </button>
        <button
          onClick={handleDownload}
          disabled={isRegenerating}
          className="bg-pink-500 text-white py-3 px-8 border-2 border-pink-300 hover:bg-pink-600 active:bg-pink-700 text-xl transform hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {hasVideo ? 'DOWNLOAD VIDEO' : 'DOWNLOAD'}
        </button>
        {!hasVideo && (
            <button
                onClick={onBringToLife}
                disabled={isRegenerating}
                className="bg-yellow-400 text-black py-3 px-8 border-2 border-yellow-200 hover:bg-yellow-300 active:bg-yellow-500 text-xl transform hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
                BRING TO LIFE
            </button>
        )}
      </div>

      {isPreviewOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div 
            className="relative p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-2 right-2 text-white bg-pink-500 rounded-full h-10 w-10 flex items-center justify-center text-2xl font-bold border-2 border-white z-10 hover:bg-pink-600 transition-colors"
              onClick={() => setIsPreviewOpen(false)}
              aria-label="Close preview"
            >
              &times;
            </button>
            {hasVideo ? (
              <video 
                src={videoUrl} 
                controls 
                autoPlay 
                loop 
                className="max-w-[90vw] max-h-[90vh] object-contain" 
              />
            ) : (
              <img 
                src={imageUrl} 
                alt="Full size 80s glamour shot" 
                className="max-w-[90vw] max-h-[90vh] object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultView;