import { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { transcribeAudio } from '../services/api.js';

export default function AudioRecorder({ onTranscript, disabled }) {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setTranscribing(true);
        try {
          const transcript = await transcribeAudio(blob);
          if (transcript?.trim()) {
            onTranscript(transcript.trim());
          }
        } catch (err) {
          console.error('Transcription failed:', err);
        } finally {
          setTranscribing(false);
        }
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error('Microphone access denied:', err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const handleClick = () => {
    if (recording) stopRecording();
    else startRecording();
  };

  const isLoading = transcribing;
  const icon = isLoading ? <Loader2 size={18} className="spin" /> : recording ? <Square size={18} /> : <Mic size={18} />;
  const title = isLoading
    ? 'Transcribing…'
    : recording
    ? 'Stop recording'
    : 'Start voice input';

  return (
    <button
      className={`icon-btn mic-btn ${recording ? 'recording' : ''}`}
      onClick={handleClick}
      disabled={disabled || isLoading}
      title={title}
      aria-label={title}
    >
      {icon}
    </button>
  );
}
