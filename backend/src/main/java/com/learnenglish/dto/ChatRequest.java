package com.learnenglish.dto;

import java.util.List;

public record ChatRequest(String message, List<MessageHistory> history) {}
