package com.tarumt.tarumt_resorts.boundary;

import com.tarumt.tarumt_resorts.control.HousekeepingControl;
import com.tarumt.tarumt_resorts.dto.RoomStatusSummaryDTO;
import com.tarumt.tarumt_resorts.dto.StaffTurnaroundDTO;
import com.tarumt.tarumt_resorts.entity.Room;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/housekeeping")
@CrossOrigin(origins = "*")
public class HousekeepingBoundary {

    private final HousekeepingControl housekeepingControl;
    public HousekeepingBoundary(HousekeepingControl housekeepingControl) {
        this.housekeepingControl = housekeepingControl;
    }

    @GetMapping("/rooms")
    public List<Room> getRooms() {
        return housekeepingControl.getAllRooms();
    }

    // staffId is optional (pass "" if not assigning a specific staff member).
    @PostMapping("/advance")
    public String advanceStatus(
            @RequestParam String roomId,
            @RequestParam(defaultValue = "") String staffId,
            @RequestParam(defaultValue = "") String remarks) {
        return housekeepingControl.advanceRoomStatus(roomId, staffId, remarks);
    }

    // Now scoped to a single room - rolling back Room A can never
    // accidentally undo Room B's last action.
    @PostMapping("/rollback")
    public String rollback(@RequestParam String roomId) {
        return housekeepingControl.rollbackLastAction(roomId);
    }

    // Multi-criteria: status AND minimum minutes waiting, both optional
    @GetMapping("/reports/room-status")
    public RoomStatusSummaryDTO[] roomStatusReport(
            @RequestParam(defaultValue = "") String filterStatus,
            @RequestParam(required = false) Long minMinutesWaiting) {
        return housekeepingControl.generateRoomStatusReport(filterStatus, minMinutesWaiting);
    }

    // Multi-criteria: staff AND completion date range, both optional
    @GetMapping("/reports/staff-turnaround")
    public StaffTurnaroundDTO[] staffTurnaroundReport(
            @RequestParam(defaultValue = "") String filterStaffId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime rangeStart,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime rangeEnd) {
        return housekeepingControl.generateStaffTurnaroundReport(filterStaffId, rangeStart, rangeEnd);
    }
}