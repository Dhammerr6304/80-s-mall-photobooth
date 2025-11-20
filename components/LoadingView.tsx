/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "TEASING YOUR HAIR...",
  "APPLYING BLUE EYESHADOW...",
  "ADJUSTING THE SHOULDER PADS...",
  "CHOOSING A LASER BACKGROUND...",
  "REWINDING THE CASSETTE TAPE...",
  "PEG ROLLING YOUR JEANS...",
  "DEVELOPING THE FILM... PLEASE WAIT...",
  "GETTING YOUR GLAMOUR SHOT READY...",
];

const LoadingView: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full text-center p-8 border-2 border-yellow-300 bg-black bg-opacity-50">
      <div className="text-2xl text-yellow-300">
        {loadingMessages[messageIndex % loadingMessages.length]}
        <span className="animate-ping">_</span>
      </div>
    </div>
  );
};

export default LoadingView;