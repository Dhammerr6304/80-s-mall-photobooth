
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';

interface VideoPromptModalProps {
  onClose: () => void;
  onSubmit: (prompt: string) => void;
  forceReselect: boolean;
}

const VideoPromptModal: React.FC<VideoPromptModalProps> = ({ onClose, onSubmit, forceReselect }) => {
  const [prompt, setPrompt] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [checkingKey, setCheckingKey] = useState(true);

  useEffect(() => {
    const checkKey = async () => {
      // If we need to reselect, act as if no key is present
      if (forceReselect) {
        setHasKey(false);
        setCheckingKey(false);
        return;
      }
      
      try {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } catch (e) {
        console.warn("Error checking for API key:", e);
        setHasKey(false);
      } finally {
        setCheckingKey(false);
      }
    };
    checkKey();
  }, [forceReselect]);

  const handleSelectKey = async () => {
    try {
      await window.aistudio.openSelectKey();
      // Assume success after modal interaction
      setHasKey(true);
    } catch (e) {
      console.error("Error selecting API key:", e);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-40 animate-fade-in" onClick={onClose}>
      <div className="bg-gray-900 border-2 border-pink-500 p-8 w-full max-w-lg box-glow-cyan relative" onClick={e => e.stopPropagation()}>
        <h3 className="text-2xl text-glow-pink mb-4 text-center">Bring Your Photo to Life!</h3>
        
        {checkingKey ? (
          <div className="text-center text-cyan-400 py-8">Checking permissions...</div>
        ) : !hasKey ? (
          <div className="text-center mb-6 animate-fade-in">
            <p className="text-cyan-300 mb-4">
              To generate a video, please select your Google AI API key.
            </p>
            <button 
              onClick={handleSelectKey}
              className="bg-yellow-400 text-black py-3 px-6 border-2 border-yellow-200 hover:bg-yellow-300 active:bg-yellow-500 text-lg mb-4"
            >
              SELECT API KEY
            </button>
            <p className="text-sm text-cyan-500 mt-4">
              See <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline hover:text-pink-400 transition-colors"
              >
                Billing Documentation
              </a> for more info.
            </p>
          </div>
        ) : (
          <>
            <p className="text-center text-cyan-300 mb-6">Describe how you want this image to move. (e.g., "The person winks and the lasers flash")</p>
            
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Make it move..."
                autoFocus
                required
                className="w-full bg-gray-800 border-2 border-cyan-400 text-white p-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <div className="flex justify-center space-x-4 pt-2">
                 <button type="button" onClick={onClose} className="bg-gray-600 text-white py-2 px-8 border-2 border-gray-400 hover:bg-gray-700 text-lg transition-colors">
                  CANCEL
                </button>
                <button type="submit" className="bg-pink-500 text-white py-2 px-8 border-2 border-pink-300 hover:bg-pink-600 text-lg transition-colors">
                  GENERATE
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoPromptModal;
