package com.learnenglish.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Base64;
import java.util.Map;

@Service
public class ElevenLabsService {

    private static final String TTS_BASE_URL = "https://api.elevenlabs.io/v1/text-to-speech/";

    @Value("${elevenlabs.api-key}")
    private String apiKey;

    @Value("${elevenlabs.voice-id}")
    private String voiceId;

    private final WebClient webClient;

    public ElevenLabsService(WebClient webClient) {
        this.webClient = webClient;
    }

    public String synthesize(String text) {
        Map<String, Object> requestBody = Map.of(
                "text", text,
                "model_id", "eleven_monolingual_v1",
                "voice_settings", Map.of(
                        "stability", 0.5,
                        "similarity_boost", 0.75
                )
        );

        byte[] audioBytes = webClient.post()
                .uri(TTS_BASE_URL + voiceId)
                .header("xi-api-key", apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(byte[].class)
                .block();

        if (audioBytes == null) {
            throw new RuntimeException("No audio data returned from ElevenLabs");
        }
        return Base64.getEncoder().encodeToString(audioBytes);
    }
}
