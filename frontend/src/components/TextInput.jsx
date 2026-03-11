import { useState, useRef, useEffect } from 'react';
import AudioRecorder from './AudioRecorder.jsx';

export default function TextInput({ onSend, disabled }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTranscript = (transcript) => {
    onSend(transcript);
  };

  return (
    <div className="input-area">
      <div className="text-input-wrapper">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message… (Enter to send)"
          disabled={disabled}
          rows={1}
          aria-label="Message input"
        />
      </div>

      <AudioRecorder onTranscript={handleTranscript} disabled={disabled} />

      <button
        className="icon-btn send-btn"
        onClick={handleSend}
        disabled={!text.trim() || disabled}
        title="Send message"
        aria-label="Send message"
      >
        ➤
      </button>
    </div>
  );
}
