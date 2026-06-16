package com.nexchat.dto.request;

import com.nexchat.enums.RoomType;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class CreateRoomRequest {
    @NotBlank private String name;
    private String description;
    private RoomType type = RoomType.GROUP;
    private List<String> memberIds;

    public String getName() { return name; }
    public void setName(String v) { this.name=v; }
    public String getDescription() { return description; }
    public void setDescription(String v) { this.description=v; }
    public RoomType getType() { return type; }
    public void setType(RoomType v) { this.type=v; }
    public List<String> getMemberIds() { return memberIds; }
    public void setMemberIds(List<String> v) { this.memberIds=v; }
}
