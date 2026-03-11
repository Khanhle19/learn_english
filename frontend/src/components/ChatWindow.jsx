import { useEffect, useRef } from 'react';

function playAudio(base64) {
  const audio = new Audio(`data:audio/mp3;base64,${base64}`);
  audio.play().catch(() => {});
}

export default function ChatWindow({ messages, loading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="chat-container">
      {messages.map((msg, idx) => (
        <div key={idx} className={`message ${msg.role}`}>
          <div className="msg-avatar">
            {msg.role === 'assistant' ? '👩‍🏫' : '🧑'}
          </div>
          <div className="msg-bubble">
            {msg.content}
            {msg.role === 'assistant' && msg.audio && (
              <button
                className="replay-btn"
                onClick={() => playAudio(msg.audio)}
                title="Replay audio"
              >
                ▶ Play
              </button>
            )}
          </div>
        </div>
      ))}

      {loading && (
        <div className="message assistant">
          <div className="msg-avatar">👩‍🏫</div>
          <div className="msg-bubble">
            <div className="typing-dots">
              <span /><span /><span />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
