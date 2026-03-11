package com.learnenglish.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;

@Service
public class WhisperService {

    private static final String WHISPER_URL = "https://api.openai.com/v1/audio/transcriptions";

    @Value("${openai.api-key}")
    private String apiKey;

    private final WebClient webClient;

    public WhisperService(WebClient webClient) {
        this.webClient = webClient;
    }

    public String transcribe(MultipartFile file) throws IOException {
        byte[] bytes = file.getBytes();
        String filename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "audio.webm";

        ByteArrayResource audioResource = new ByteArrayResource(bytes) {
            @Override
            public String getFilename() {
                return filename;
            }
        };

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("model", "whisper-1");
        body.add("file", audioResource);

        JsonNode response = webClient.post()
                .uri(WHISPER_URL)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData(body))
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        if (response == null || !response.has("text")) {
            throw new RuntimeException("Unexpected response from Whisper API");
        }
        return response.get("text").asText();
    }
}
