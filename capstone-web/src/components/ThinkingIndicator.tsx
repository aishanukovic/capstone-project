import React from 'react';

const ThinkingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-1 px-4 text-sm text-gray-500 mt-1">
      <span>Holly is thinking</span>
      <span className="flex space-x-1">
        <span className="animate-bounce [animation-delay:0ms]">.</span>
        <span className="animate-bounce [animation-delay:150ms]">.</span>
        <span className="animate-bounce [animation-delay:300ms]">.</span>
      </span>
    </div>
  );
};

export default ThinkingIndicator;