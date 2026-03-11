import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 60000,
});

export async function transcribeAudio(audioBlob) {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');
  const { data } = await api.post('/transcribe', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.transcript;
}

export async function sendMessage(message, history = []) {
  const { data } = await api.post('/chat', { message, history });
  return data;
}
