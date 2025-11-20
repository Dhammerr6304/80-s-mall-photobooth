/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full max-w-2xl text-center border-2 border-cyan-400 p-4 box-glow-cyan bg-black bg-opacity-20">
      <h1 className="text-4xl sm:text-5xl text-glow-cyan">80's Mall Photo</h1>
      <h2 className="text-lg sm:text-xl text-pink-500 text-glow-pink mt-1">Your Totally Awesome Photoshoot!</h2>
    </header>
  );
};

export default Header;