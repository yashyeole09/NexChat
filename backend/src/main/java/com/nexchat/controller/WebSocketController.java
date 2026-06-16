package com.nexchat.controller;

import com.nexchat.dto.request.SendMessageRequest;
import com.nexchat.dto.response.MessageResponse;
import com.nexchat.service.ChatService;
import com.nexchat.service.impl.AiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import java.security.Principal;
import java.util.Map;

@Controller
public class WebSocketController {
    private static final Logger log = LoggerFactory.getLogger(WebSocketController.class);

    private final ChatService chatService;
    private final AiService aiService;
    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketController(ChatService chatService, AiService aiService, SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.aiService = aiService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload SendMessageRequest request, Principal principal) {
        try {
            String userId = principal.getName();
            MessageResponse message = chatService.sendMessage(request, userId);
            String content = request.getContent();
            if (content.startsWith("@ai ") || content.startsWith("@nexbot ")) {
                String query = content.substring(content.indexOf(' ') + 1);
                aiService.generateAiResponse(query, "").thenAccept(aiReply -> {
                    SendMessageRequest aiReq = new SendMessageRequest();
                    aiReq.setContent("🤖 " + aiReply);
                    aiReq.setRoomId(request.getRoomId());
                    chatService.sendMessage(aiReq, userId);
                });
            }
        } catch (Exception e) { log.error("WS message error: {}", e.getMessage()); }
    }

    @MessageMapping("/chat.typing")
    public void typing(@Payload Map<String,String> payload, Principal principal) {
        String roomId = payload.get("roomId");
        messagingTemplate.convertAndSend("/topic/room/" + roomId + "/typing",
            Map.of("username", principal.getName(), "typing", payload.get("typing")));
    }

    @MessageMapping("/chat.read")
    public void markRead(@Payload Map<String,String> payload, Principal principal) {
        String roomId = payload.get("roomId");
        messagingTemplate.convertAndSend("/topic/room/" + roomId + "/read",
            Map.of("userId", principal.getName(), "roomId", roomId));
    }
}
