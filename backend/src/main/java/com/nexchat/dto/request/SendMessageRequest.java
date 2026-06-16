package com.nexchat.dto.request;

import com.nexchat.enums.MessageType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SendMessageRequest {
    @NotBlank private String content;
    @NotNull private String roomId;
    private MessageType type = MessageType.TEXT;
    private String replyToId;
    private String fileUrl;
    private String fileName;

    public String getContent() { return content; }
    public void setContent(String v) { this.content=v; }
    public String getRoomId() { return roomId; }
    public void setRoomId(String v) { this.roomId=v; }
    public MessageType getType() { return type; }
    public void setType(MessageType v) { this.type=v; }
    public String getReplyToId() { return replyToId; }
    public void setReplyToId(String v) { this.replyToId=v; }
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String v) { this.fileUrl=v; }
    public String getFileName() { return fileName; }
    public void setFileName(String v) { this.fileName=v; }
}
