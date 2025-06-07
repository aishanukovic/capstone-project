import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

interface ChatSearchProps {
  onSearchSelect: (sessionId: string, messageId: string, keyword: string) => void;
  getToken: () => Promise<string>;
}

const ChatSearch: React.FC<ChatSearchProps> = ({ onSearchSelect, getToken }) => {
  const [query, setQuery] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const token = await getToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/chats/search?q=${encodeURIComponent(query)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setResults(data.matches);
    } catch (err) {
      console.error('Chat search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 text-sm text-white">
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="w-full px-2 py-1 rounded text-black"
          placeholder="Search chats..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
        />
        <button
          onClick={handleSearch}
          className="bg-white text-[#612bcd] px-2 py-1 rounded hover:bg-gray-100"
        >
          <FaSearch />
        </button>
      </div>

      {loading && <p className="text-xs text-gray-300">Searching...</p>}

      {!loading && results.length > 0 && (
        <div className="bg-white text-black rounded p-2 max-h-48 overflow-y-auto space-y-2">
          {results.map((r, idx) => (
            <div
              key={idx}
              className="cursor-pointer hover:bg-gray-100 p-1 rounded"
              onClick={() => onSearchSelect(r.sessionId, r.messageId, query)}
            >
              <p className="text-sm font-semibold">{r.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatSearch;