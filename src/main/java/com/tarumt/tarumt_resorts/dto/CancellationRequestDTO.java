package com.tarumt.tarumt_resorts.dto;

// DTO for guest cancellation request
public class CancellationRequestDTO {
    private String reason;

    public CancellationRequestDTO() {}

    public CancellationRequestDTO(String reason) {
        this.reason = reason;
    }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
