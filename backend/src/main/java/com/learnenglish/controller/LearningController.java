package com.learnenglish.controller;

import com.learnenglish.dto.ChatRequest;
import com.learnenglish.dto.ChatResponse;
import com.learnenglish.dto.TranscribeResponse;
import com.learnenglish.service.ElevenLabsService;
import com.learnenglish.service.GptService;
import com.learnenglish.service.WhisperService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api")
public class LearningController {

    private final WhisperService whisperService;
    private final GptService gptService;
    private final ElevenLabsService elevenLabsService;

    public LearningController(WhisperService whisperService,
                              GptService gptService,
                              ElevenLabsService elevenLabsService) {
        this.whisperService = whisperService;
        this.gptService = gptService;
        this.elevenLabsService = elevenLabsService;
    }

    @PostMapping("/transcribe")
    public ResponseEntity<TranscribeResponse> transcribe(
            @RequestParam("audio") MultipartFile file) throws IOException {
        String transcript = whisperService.transcribe(file);
        return ResponseEntity.ok(new TranscribeResponse(transcript));
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        String reply = gptService.chat(request.message(), request.history());
        String audio = elevenLabsService.synthesize(reply);
        return ResponseEntity.ok(new ChatResponse(reply, audio));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }
}
