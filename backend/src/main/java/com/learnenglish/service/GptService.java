package com.learnenglish.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.learnenglish.dto.MessageHistory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class GptService {

    private static final String GPT_URL = "https://api.openai.com/v1/chat/completions";

    @Value("${openai.api-key}")
    private String apiKey;

    @Value("${emily.system-prompt}")
    private String emilySystemPrompt;

    private final WebClient webClient;

    public GptService(WebClient webClient) {
        this.webClient = webClient;
    }

    public String chat(String userMessage, List<MessageHistory> history) {
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", emilySystemPrompt));

        if (history != null) {
            for (MessageHistory entry : history) {
                messages.add(Map.of("role", entry.role(), "content", entry.content()));
            }
        }
        messages.add(Map.of("role", "user", "content", userMessage));

        Map<String, Object> requestBody = Map.of(
                "model", "gpt-4",
                "messages", messages,
                "temperature", 0.7,
                "max_tokens", 512
        );

        JsonNode response = webClient.post()
                .uri(GPT_URL)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        if (response == null || !response.has("choices")) {
            throw new RuntimeException("Unexpected response from GPT API");
        }
        return response.get("choices").get(0).get("message").get("content").asText();
    }
}
