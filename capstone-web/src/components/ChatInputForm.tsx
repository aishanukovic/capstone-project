import type { RefObject } from 'react';

type Props = {
  query: string;
  setQuery: (text: string) => void;
  loading: boolean;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  onSubmit: (e: React.FormEvent) => void;
};

const ChatInputForm: React.FC<Props> = ({ query, setQuery, loading, inputRef, onSubmit }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex gap-2 sticky bottom-0 bg-[#f9f7fc] pt-2 z-10">
      <textarea
        ref={inputRef}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 96) + 'px';
          }
        }}
        onKeyDown={handleKeyDown}
        disabled={loading}
        placeholder="Type your question..."
        rows={1}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-md resize-none overflow-y-auto max-h-24 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-[#6b3c9a] text-white px-6 py-2 rounded-md hover:bg-[#5a3282] transition-all"
      >
        {loading ? '...' : 'Ask'}
      </button>
    </form>
  );
};

export default ChatInputForm;