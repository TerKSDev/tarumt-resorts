package com.tarumt.tarumt_resorts.dto;

// DTO for room assignment request
public class RoomAssignmentDTO {
    private String roomId;

    public RoomAssignmentDTO() {}

    public RoomAssignmentDTO(String roomId) {
        this.roomId = roomId;
    }

    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }
}
