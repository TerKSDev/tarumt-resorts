package com.tarumt.tarumt_resorts.entity.dto;

import com.tarumt.tarumt_resorts.entity.enums.HousekeepingStatus;

/**
 * Plain data holder for the "Room Housekeeping Status Report".
 * Not a JPA entity - not persisted, only used to shape report output.
 * Author: <your name>
 */
public class RoomStatusSummaryDTO {

    private String roomId;
    private HousekeepingStatus currentStage;
    private HousekeepingStatus nextStage; // null if already at final stage
    private long minutesInCurrentStage;
    private boolean canRollback;

    public RoomStatusSummaryDTO(String roomId, HousekeepingStatus currentStage, HousekeepingStatus nextStage,
                                 long minutesInCurrentStage, boolean canRollback) {
        this.roomId = roomId;
        this.currentStage = currentStage;
        this.nextStage = nextStage;
        this.minutesInCurrentStage = minutesInCurrentStage;
        this.canRollback = canRollback;
    }

    public String getRoomId() { return roomId; }
    public HousekeepingStatus getCurrentStage() { return currentStage; }
    public HousekeepingStatus getNextStage() { return nextStage; }
    public long getMinutesInCurrentStage() { return minutesInCurrentStage; }
    public boolean isCanRollback() { return canRollback; }
}