
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="inline-block bg-cyan-500/10 text-cyan-400 py-1 px-3 rounded-full text-sm font-medium">
        Powered by Gemini AI
      </div>
      <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
        AI Phishing Detector
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
        Paste the contents of a suspicious email below. Our AI will analyze the text, sender, and links to identify potential phishing threats.
      </p>
    </header>
  );
};
