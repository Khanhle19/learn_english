import { useEffect, useRef } from 'react';
import { GraduationCap, User } from 'lucide-react';
import AudioPlayer from './AudioPlayer.jsx';

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
            {msg.role === 'assistant' ? <GraduationCap size={18} /> : <User size={18} />}
          </div>
          <div className="msg-bubble">
            {msg.content}
            {msg.role === 'assistant' && msg.audio && (
              <AudioPlayer base64={msg.audio} />
            )}
          </div>
        </div>
      ))}

      {loading && (
        <div className="message assistant">
          <div className="msg-avatar"><GraduationCap size={18} /></div>
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
