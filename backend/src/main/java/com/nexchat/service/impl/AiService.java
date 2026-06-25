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

    @Value("${ai.gemini.api-key}") private String apiKey;
    @Value("${ai.gemini.base-url}") private String baseUrl;

    private final OkHttpClient httpClient = new OkHttpClient.Builder()
        .connectTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
        .readTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
        .build();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Async
    public CompletableFuture<String> generateAiResponse(String userMessage, String context) {
        try {
            String prompt = (context != null && !context.isEmpty())
                ? "Context: " + context + "\n\nUser: " + userMessage
                : userMessage;

            String requestBody = objectMapper.writeValueAsString(
                objectMapper.createObjectNode()
                    .set("contents", objectMapper.createArrayNode()
                        .add(objectMapper.createObjectNode()
                            .set("parts", objectMapper.createArrayNode()
                                .add(objectMapper.createObjectNode()
                                    .put("text", prompt))))));

            String url = baseUrl + "?key=" + apiKey;
            log.info("Calling Gemini API at: {}", baseUrl);

            Request request = new Request.Builder()
                .url(url)
                .post(RequestBody.create(requestBody, MediaType.parse("application/json")))
                .build();

            try (Response response = httpClient.newCall(request).execute()) {
                String responseBody = response.body() != null ? response.body().string() : "";
                log.info("Gemini API response code: {}", response.code());

                if (!response.isSuccessful()) {
                    log.error("Gemini API error: {} - {}", response.code(), responseBody);
                    return CompletableFuture.completedFuture(
                        "AI service error " + response.code() + ". Please check API key."
                    );
                }

                JsonNode root = objectMapper.readTree(responseBody);

                // Check for API error in response
                if (root.has("error")) {
                    String errorMsg = root.path("error").path("message").asText("Unknown error");
                    log.error("Gemini API returned error: {}", errorMsg);
                    return CompletableFuture.completedFuture("AI error: " + errorMsg);
                }

                String text = root.path("candidates").path(0)
                    .path("content").path("parts").path(0)
                    .path("text").asText("");

                if (text.isEmpty()) {
                    log.warn("Empty response from Gemini: {}", responseBody);
                    return CompletableFuture.completedFuture("No response generated.");
                }

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