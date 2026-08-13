package com.tarumt.tarumt_resorts.entity.dto;

import java.time.LocalDateTime;

/**
 * Plain data holder for the "Staff Cleaning Turnaround Report".
 * Represents one completed cleaning cycle (DIRTY -> READY_FOR_CHECKIN)
 * for a room, attributed to the staff who completed the final step.
 * Not a JPA entity - not persisted, only used to shape report output.
 * Author: See Wei Jian
 */
public class StaffTurnaroundDTO {

    private String roomId;
    private String staffId;
    private String staffName;
    private LocalDateTime cycleStart;
    private LocalDateTime cycleEnd;
    private long durationMinutes;

    public StaffTurnaroundDTO(String roomId, String staffId, String staffName,
                               LocalDateTime cycleStart, LocalDateTime cycleEnd, long durationMinutes) {
        this.roomId = roomId;
        this.staffId = staffId;
        this.staffName = staffName;
        this.cycleStart = cycleStart;
        this.cycleEnd = cycleEnd;
        this.durationMinutes = durationMinutes;
    }

    public String getRoomId() { return roomId; }
    public String getStaffId() { return staffId; }
    public String getStaffName() { return staffName; }
    public LocalDateTime getCycleStart() { return cycleStart; }
    public LocalDateTime getCycleEnd() { return cycleEnd; }
    public long getDurationMinutes() { return durationMinutes; }
}