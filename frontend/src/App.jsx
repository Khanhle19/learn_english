import { useState, useCallback } from 'react';
import ChatWindow from './components/ChatWindow.jsx';
import TextInput from './components/TextInput.jsx';
import { sendMessage } from './services/api.js';
import './App.css';

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: "Hi! I'm Emily, your personal English tutor. 😊 Let's practice together! You can type a message or tap the microphone to speak. What would you like to talk about today?",
};

export default function App() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = useCallback(async (text) => {
    if (!text.trim() || loading) return;

    const userMessage = { role: 'user', content: text.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);
    setError(null);

    try {
      const history = messages.map(({ role, content }) => ({ role, content }));
      const response = await sendMessage(text.trim(), history);

      const assistantMessage = {
        role: 'assistant',
        content: response.text,
        audio: response.audio,
      };

      setMessages([...updatedMessages, assistantMessage]);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="emily-avatar">👩‍🏫</div>
        <div className="emily-info">
          <h1>Emily</h1>
          <div className="emily-status">
            <span className={`status-dot ${loading ? 'typing' : ''}`} />
            {loading ? 'Typing…' : 'English Tutor · Online'}
          </div>
        </div>
      </header>

      <ChatWindow messages={messages} loading={loading} />

      {error && <div className="error-toast">{error}</div>}

      <TextInput onSend={handleSend} disabled={loading} />
    </div>
  );
}
