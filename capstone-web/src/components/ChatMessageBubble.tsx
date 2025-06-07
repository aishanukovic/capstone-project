import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type ChatMessage = {
  sender: 'user' | 'ai';
  message: string;
  _id?: string;
};

type Props = {
  message: ChatMessage;
  highlightMessageId?: string | null;
  highlightKeyword?: string | null;
};

const ChatMessageBubble: React.FC<Props> = ({ message, highlightMessageId, highlightKeyword }) => {
  const isUser = message.sender === 'user';
  const isHighlighted = message._id && message._id === highlightMessageId;

  const highlightText = (input: React.ReactNode): React.ReactNode => {
    if (!isHighlighted || !highlightKeyword) return input;

    if (typeof input === 'string') {
      const parts = input.split(new RegExp(`(${highlightKeyword})`, 'gi'));
      return parts.map((part, i) =>
        part.toLowerCase() === highlightKeyword.toLowerCase() ? (
          <span key={i} className="bg-yellow-300">{part}</span>
        ) : (
          part
        ),
      );
    }

    if (Array.isArray(input)) {
      return input.map((child, index) => (
        <React.Fragment key={index}>{highlightText(child)}</React.Fragment>
      ));
    }

    return input;
  };

  return (
    <div
      className={`p-3 rounded-lg shadow-md w-fit max-w-[80%] ${
        isUser ? 'self-end bg-[#e2d5f2] text-right ml-auto' : 'self-start bg-[#f0ebf8]'
      }`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ node, children, ...props }) => {
            const isFirstParagraph = (node?.position?.start?.offset ?? 0) === 0;
            return (
              <p className="prose prose-sm max-w-none text-left" {...props}>
                {isFirstParagraph ? (
                  <>
                    <strong>{isUser ? 'You: ' : 'Holly: '}</strong>
                    {highlightText(children)}
                  </>
                ) : (
                  highlightText(children)
                )}
              </p>
            );
          },
          ul: ({ children }) => (
            <ul className="prose prose-sm max-w-none list-disc pl-5 text-left">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="prose prose-sm max-w-none list-decimal pl-5 text-left">{children}</ol>
          ),
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          h1: ({ children }) => <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-semibold mt-3 mb-1">{children}</h2>,
        }}
      >
        {message.message.replace(/\n(?!\n)/g, '\n\n')}
      </ReactMarkdown>
    </div>
  );
};

export default ChatMessageBubble;