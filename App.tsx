
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback } from 'react';
import { AppState } from './types';
import { startImageChatSession, continueImageChatSession, generateVideoFromImage } from './services/geminiService';
import Header from './components/Header';
import ImageInput from './components/ImageInput';
import LoadingView from './components/LoadingView';
import ResultView from './components/ResultView';
import VideoPromptModal from './components/VideoPromptModal';
import Spinner from './components/Spinner';
import { Content } from '@google/genai';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [outputImageUrl, setOutputImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editErrorMessage, setEditErrorMessage] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<Content[]>([]);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [mustReselectKey, setMustReselectKey] = useState(false);

  const handleImageReady = useCallback(async ({ data, mimeType }: { data: string; mimeType: string }) => {
    setAppState(AppState.PROCESSING);
    setErrorMessage(null);
    setOutputImageUrl(null);
    setConversationHistory([]);
    try {
      const { imageUrl, history } = await startImageChatSession(data, mimeType);
      setOutputImageUrl(imageUrl);
      setConversationHistory(history);
      setAppState(AppState.RESULT);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      setErrorMessage(`GENERATION FAILED: ${message}`);
      setAppState(AppState.ERROR);
    }
  }, []);

  const handleEditImage = useCallback(async (prompt: string) => {
    if (!conversationHistory.length) return;
    setIsRegenerating(true);
    setEditErrorMessage(null);
    try {
      const { imageUrl, newHistory } = await continueImageChatSession(conversationHistory, prompt);
      setOutputImageUrl(imageUrl);
      setConversationHistory(newHistory);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      setEditErrorMessage(`REMIX FAILED: ${message}`);
    } finally {
      setIsRegenerating(false);
    }
  }, [conversationHistory]);

  const handleGenerateVideo = useCallback(async (prompt: string) => {
    if (!outputImageUrl) return;
    setShowVideoModal(false);
    setIsGeneratingVideo(true);
    setVideoError(null);
    try {
        const generatedVideoUrl = await generateVideoFromImage(outputImageUrl, prompt);
        setVideoUrl(generatedVideoUrl);
        setMustReselectKey(false); // Reset on success
    } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        
        // Check for 404/Not Found entity which implies we might need to re-select API key for Veo
        if (message.includes("Requested entity was not found") || message.includes("404")) {
          setMustReselectKey(true);
          setVideoError("Authorization failed. Please select a valid API key.");
          // Re-open the modal so the user can fix it immediately.
          setShowVideoModal(true);
        } else {
          setVideoError(`VIDEO FAILED: ${message}`);
        }
    } finally {
        setIsGeneratingVideo(false);
    }
  }, [outputImageUrl]);


  const handleReset = useCallback(() => {
    setAppState(AppState.IDLE);
    setOutputImageUrl(null);
    setErrorMessage(null);
    setEditErrorMessage(null);
    setConversationHistory([]);
    setShowVideoModal(false);
    setIsGeneratingVideo(false);
    setVideoUrl(null);
    setVideoError(null);
    setMustReselectKey(false);
  }, []);

  const renderContent = () => {
    switch (appState) {
      case AppState.PROCESSING:
        return <LoadingView />;
      case AppState.RESULT:
        return outputImageUrl ? (
          <ResultView
            imageUrl={outputImageUrl}
            videoUrl={videoUrl}
            onReset={handleReset}
            onEdit={handleEditImage}
            onBringToLife={() => setShowVideoModal(true)}
            isRegenerating={isRegenerating}
            editError={editErrorMessage}
            videoError={videoError}
          />
        ) : null;
      case AppState.ERROR:
        return (
          <div className="text-center text-red-500 bg-black bg-opacity-50 p-6 border border-red-500">
            <h2 className="text-2xl mb-4">SYSTEM ERROR</h2>
            <p className="text-lg">{errorMessage}</p>
            <button
              onClick={handleReset}
              className="mt-6 bg-pink-500 text-white py-2 px-6 border-2 border-pink-300 hover:bg-pink-600 active:bg-pink-700 text-lg"
            >
              TRY AGAIN
            </button>
          </div>
        );
      case AppState.IDLE:
      default:
        return <ImageInput onImageReady={handleImageReady} />;
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-900 text-cyan-400 p-4 sm:p-8 flex flex-col items-center"
      style={{
        backgroundColor: '#1a102c',
        backgroundImage: `
          linear-gradient(rgba(26, 16, 44, 0.8), rgba(26, 16, 44, 0.8)),
          linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, 0.1) 25%, rgba(0, 255, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.1) 75%, rgba(0, 255, 255, 0.1) 76%, transparent 77%, transparent),
          linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, 0.1) 25%, rgba(0, 255, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.1) 75%, rgba(0, 255, 255, 0.1) 76%, transparent 77%, transparent)
        `,
        backgroundSize: '100%, 50px 50px, 50px 50px',
      }}
    >
      {isGeneratingVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
          <Spinner />
          <p className="text-yellow-300 text-2xl mt-6">BRINGING YOUR PHOTO TO LIFE...</p>
          <p className="text-cyan-400 text-lg mt-2">(This can take up to a minute)</p>
        </div>
      )}
      {showVideoModal && (
        <VideoPromptModal 
          onClose={() => setShowVideoModal(false)}
          onSubmit={handleGenerateVideo}
          forceReselect={mustReselectKey}
        />
      )}
      <Header />
      <main className="w-full max-w-2xl flex-grow flex flex-col justify-center items-center mt-8">
        {renderContent()}
      </main>
      <footer className="text-center text-sm text-cyan-600 mt-8">
        <p>
          Made by{' '}
          <a
            href="https://x.com/YaakovLyubetsky"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-pink-400 transition-colors"
          >
            yaakov@
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
