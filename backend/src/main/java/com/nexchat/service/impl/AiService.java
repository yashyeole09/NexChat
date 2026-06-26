package com.nexchat.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.util.concurrent.CompletableFuture;

@Service
public class AiService {
    private static final Logger log = LoggerFactory.getLogger(AiService.class);

    @Value("${ai.groq.api-key}") private String apiKey;

    private final OkHttpClient httpClient = new OkHttpClient.Builder()
        .connectTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
        .readTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
        .build();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String API_URL = "https://api.groq.com/openai/v1/chat/completions";

    @Async
    public CompletableFuture<String> generateAiResponse(String userMessage, String context) {
        try {
            String prompt = (context != null && !context.isEmpty())
                ? "Context: " + context + "\n\nUser: " + userMessage
                : userMessage;

            String requestBody = objectMapper.writeValueAsString(
                objectMapper.createObjectNode()
                    .put("model", "llama-3.1-8b-instant")
                    .set("messages", objectMapper.createArrayNode()
                        .add(objectMapper.createObjectNode()
                            .put("role", "system")
                            .put("content", "You are NexBot, a helpful AI assistant in NexChat. Be concise and friendly."))
                        .add(objectMapper.createObjectNode())
                            .put("role", "user")
                            .put("content", prompt))));

            Request request = new Request.Builder()
                .url(API_URL)
                .post(RequestBody.create(requestBody, MediaType.parse("application/json")))
                .addHeader("Authorization", "Bearer " + apiKey)
                .addHeader("Content-Type", "application/json")
                .build();

            log.info("Calling Groq AI...");

            try (Response response = httpClient.newCall(request).execute()) {
                String responseBody = response.body() != null ? response.body().string() : "";
                log.info("Groq response code: {}", response.code());

                if (!response.isSuccessful()) {
                    log.error("Groq error: {} - {}", response.code(), responseBody);
                    return CompletableFuture.completedFuture("AI service error. Please try again.");
                }

                JsonNode root = objectMapper.readTree(responseBody);
                String text = root.path("choices").path(0)
                    .path("message").path("content").asText("");

                if (text.isEmpty()) {
                    log.warn("Empty Groq response: {}", responseBody);
                    return CompletableFuture.completedFuture("No response generated.");
                }

                log.info("Groq AI response received successfully");
                return CompletableFuture.completedFuture(text);
            }
        } catch (Exception e) {
            log.error("AI service exception: {}", e.getMessage(), e);
            return CompletableFuture.completedFuture("AI error: " + e.getMessage());
        }
    }

    public CompletableFuture<String> suggestReply(String lastMessage, String context) {
        String prompt = "Suggest 3 brief reply options for: \"" + lastMessage + "\" separated by |";
        return generateAiResponse(prompt, context);
    }

    public CompletableFuture<String> summarizeConversation(String messages) {
        return generateAiResponse("Summarize in 2-3 sentences:\n\n" + messages, "");
    }
}