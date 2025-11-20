/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';

interface ChatInputProps {
    onPromptSubmit: (prompt: string) => void;
    disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onPromptSubmit, disabled }) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim() && !disabled) {
            onPromptSubmit(prompt.trim());
            setPrompt('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex space-x-2">
            <input 
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what to change..."
                disabled={disabled}
                className="flex-grow bg-gray-800 border-2 border-cyan-400 text-white p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 box-glow-cyan"
            />
            <button type="submit" disabled={disabled} className="bg-pink-500 text-white py-3 px-6 border-2 border-pink-300 hover:bg-pink-600 active:bg-pink-700 text-lg disabled:opacity-50 disabled:cursor-not-allowed">
                REMIX
            </button>
        </form>
    );
}

export default ChatInput;
