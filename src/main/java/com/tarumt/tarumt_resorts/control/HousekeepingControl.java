package com.tarumt.tarumt_resorts.control;

import com.tarumt.tarumt_resorts.adt.MyLinkedStack;
import com.tarumt.tarumt_resorts.dao.HousekeepingTaskDAO;
import com.tarumt.tarumt_resorts.dao.RoomDAO;
import com.tarumt.tarumt_resorts.dao.StaffDAO;
import com.tarumt.tarumt_resorts.dto.RoomStatusSummaryDTO;
import com.tarumt.tarumt_resorts.dto.StaffTurnaroundDTO;
import com.tarumt.tarumt_resorts.entity.HousekeepingTask;
import com.tarumt.tarumt_resorts.entity.Room;
import com.tarumt.tarumt_resorts.entity.Staff;
import com.tarumt.tarumt_resorts.entity.enums.HousekeepingStatus;
import com.tarumt.tarumt_resorts.entity.enums.RoomStatus;
import com.tarumt.tarumt_resorts.utility.RoomStackRegistry;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class HousekeepingControl {

    private final RoomDAO roomDAO;
    private final HousekeepingTaskDAO taskDAO;
    private final StaffDAO staffDAO;

    public HousekeepingControl(RoomDAO roomDAO, HousekeepingTaskDAO taskDAO, StaffDAO staffDAO) {
        this.roomDAO = roomDAO;
        this.taskDAO = taskDAO;
        this.staffDAO = staffDAO;
    }

    // The Linear ADT required by the assignment: ONE Stack per room, so a
    // rollback for Room A can never accidentally undo Room B's last action.
    private final RoomStackRegistry stackRegistry = new RoomStackRegistry();

    // Fixed sequential workflow, as described in the assignment.
    private static final HousekeepingStatus[] STATUS_FLOW = {
        HousekeepingStatus.DIRTY,
        HousekeepingStatus.CLEANING_INPROGRESS,
        HousekeepingStatus.INSPECTING,
        HousekeepingStatus.READY_FOR_CHECKIN
    };

    // ---------------------------------------------------------------
    // Basic reads
    // ---------------------------------------------------------------

    public List<Room> getAllRooms() {
        return roomDAO.findAll();
    }

    // ---------------------------------------------------------------
    // Status mapping: HousekeepingStatus (fine-grained workflow)
    // -> RoomStatus (coarse, used by booking/other modules)
    // ---------------------------------------------------------------

    private RoomStatus toRoomStatus(HousekeepingStatus hk) {
        switch (hk) {
            case DIRTY:
            case CLEANING_INPROGRESS:
            case INSPECTING:
                return RoomStatus.CLEANING;      // not bookable during any of these stages
            case READY_FOR_CHECKIN:
                return RoomStatus.AVAILABLE;      // guest-ready
            default:
                return RoomStatus.CLEANING;
        }
    }

    private HousekeepingStatus nextStatus(HousekeepingStatus current) {
        for (int i = 0; i < STATUS_FLOW.length - 1; i++) {
            if (STATUS_FLOW[i] == current) {
                return STATUS_FLOW[i + 1];
            }
        }
        return null; // already at final stage - nothing further to advance to
    }

    private HousekeepingStatus getCurrentStage(String roomId) {
        List<HousekeepingTask> existing = taskDAO.findByRoom_RoomIdOrderByCreatedAtDesc(roomId);
        return existing.isEmpty() ? HousekeepingStatus.DIRTY : existing.get(0).getCurrentStatus();
    }

    // ---------------------------------------------------------------
    // Core operation 1: advance a room to the next sequential status
    // ---------------------------------------------------------------

    public String advanceRoomStatus(String roomId, String staffId, String remarks) {
        Room room = roomDAO.findById(roomId).orElse(null);
        if (room == null) return "Room not found!";

        HousekeepingStatus currentStage = getCurrentStage(roomId);
        HousekeepingStatus newStage = nextStatus(currentStage);

        if (newStage == null) {
            return "Room " + roomId + " is already Ready for Check-In.";
        }

        Staff staff = null;
        if (staffId != null && !staffId.isBlank()) {
            staff = staffDAO.findById(staffId).orElse(null);
        }

        HousekeepingTask task = new HousekeepingTask();
        task.setRoom(room);
        task.setStaff(staff);
        task.setOldStatus(currentStage);
        task.setCurrentStatus(newStage);
        task.setRemarks(remarks);
        HousekeepingTask savedTask = taskDAO.save(task);

        // push onto THIS room's Stack ADT so it can be rolled back independently
        stackRegistry.getStackFor(roomId).push(savedTask);

        room.setStatus(toRoomStatus(newStage));
        roomDAO.save(room);

        return "Room " + roomId + " advanced from " + currentStage + " to " + newStage;
    }

    // ---------------------------------------------------------------
    // Core operation 2: instantly roll back the most recent action
    // FOR A SPECIFIC ROOM (not a global "undo the very last click
    // anywhere in the hotel", which could undo a different room's
    // action by mistake).
    // ---------------------------------------------------------------

    public String rollbackLastAction(String roomId) {
        MyLinkedStack<HousekeepingTask> stack = stackRegistry.getStackFor(roomId);

        if (stack.isEmpty()) {
            return "No recent actions to rollback for room " + roomId + ".";
        }

        HousekeepingTask lastTask = stack.pop();
        Room room = lastTask.getRoom();
        HousekeepingStatus statusToRestore = lastTask.getOldStatus();

        room.setStatus(toRoomStatus(statusToRestore));
        roomDAO.save(room);

        // audit trail: log the rollback itself (not pushed back onto the stack,
        // so a rollback cannot itself be "un-rolled-back")
        HousekeepingTask rollbackTask = new HousekeepingTask();
        rollbackTask.setRoom(room);
        rollbackTask.setOldStatus(lastTask.getCurrentStatus());
        rollbackTask.setCurrentStatus(statusToRestore);
        rollbackTask.setRemarks("System Rollback");
        taskDAO.save(rollbackTask);

        return "Rolled back room " + room.getRoomId() + " to " + statusToRestore;
    }

    // whether a given room currently has an action that can be rolled back
    public boolean canRollback(String roomId) {
        return !stackRegistry.getStackFor(roomId).isEmpty();
    }

    // ---------------------------------------------------------------
    // Report 1: Room Housekeeping Status Report
    // - SEARCH: locate each room's latest task (its current stage)
    // - FILTER (multi-criteria): status AND a minimum "minutes waiting"
    //           threshold, applied together
    // - SORT: bubble sort by time spent in current stage, descending,
    //         to surface rooms that have been stuck longest
    // ---------------------------------------------------------------

    public RoomStatusSummaryDTO[] generateRoomStatusReport(String filterStatus, Long minMinutesWaiting) {
        List<Room> allRooms = roomDAO.findAll();

        RoomStatusSummaryDTO[] temp = new RoomStatusSummaryDTO[allRooms.size()];
        int count = 0;

        for (Room room : allRooms) {
            List<HousekeepingTask> tasks = taskDAO.findByRoom_RoomIdOrderByCreatedAtDesc(room.getRoomId());

            HousekeepingStatus stage = tasks.isEmpty()
                    ? HousekeepingStatus.DIRTY
                    : tasks.get(0).getCurrentStatus();

            LocalDateTime since = tasks.isEmpty() ? room.getCreatedAt() : tasks.get(0).getCreatedAt();
            long minutes = Duration.between(since, LocalDateTime.now()).toMinutes();

            // filter criterion 1: status (optional)
            if (filterStatus != null && !filterStatus.isBlank()
                    && !stage.name().equalsIgnoreCase(filterStatus)) {
                continue;
            }

            // filter criterion 2: minimum time waiting (optional) - combined with criterion 1
            if (minMinutesWaiting != null && minutes < minMinutesWaiting) {
                continue;
            }

            temp[count] = new RoomStatusSummaryDTO(
                    room.getRoomId(),
                    stage,
                    nextStatus(stage),
                    minutes,
                    canRollback(room.getRoomId())
            );
            count++;
        }

        RoomStatusSummaryDTO[] result = new RoomStatusSummaryDTO[count];
        for (int i = 0; i < count; i++) {
            result[i] = temp[i];
        }

        bubbleSortByMinutesDesc(result);
        return result;
    }

    private void bubbleSortByMinutesDesc(RoomStatusSummaryDTO[] arr) {
        for (int i = 0; i < arr.length - 1; i++) {
            for (int j = 0; j < arr.length - 1 - i; j++) {
                if (arr[j].getMinutesInCurrentStage() < arr[j + 1].getMinutesInCurrentStage()) {
                    RoomStatusSummaryDTO t = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = t;
                }
            }
        }
    }

    // ---------------------------------------------------------------
    // Report 2: Staff Cleaning Turnaround Report
    // - SEARCH: walk each room's chronological task history to find
    //           completed cycles (DIRTY -> ... -> READY_FOR_CHECKIN)
    // - FILTER (multi-criteria): staffId AND a completion date range,
    //           applied together
    // - SORT: bubble sort by cycle duration, ascending, to rank
    //         fastest-to-slowest turnaround
    // ---------------------------------------------------------------

    public StaffTurnaroundDTO[] generateStaffTurnaroundReport(String filterStaffId,
                                                                LocalDateTime rangeStart,
                                                                LocalDateTime rangeEnd) {
        List<Room> allRooms = roomDAO.findAll();

        StaffTurnaroundDTO[] temp = new StaffTurnaroundDTO[500];
        int count = 0;

        for (Room room : allRooms) {
            List<HousekeepingTask> history = taskDAO.findByRoom_RoomIdOrderByCreatedAtAsc(room.getRoomId());

            LocalDateTime cycleStart = null;

            for (HousekeepingTask task : history) {
                if (task.getCurrentStatus() == HousekeepingStatus.DIRTY && cycleStart == null) {
                    cycleStart = task.getCreatedAt();
                } else if (task.getCurrentStatus() == HousekeepingStatus.READY_FOR_CHECKIN && cycleStart != null) {
                    Staff staff = task.getStaff();
                    String staffId = staff != null ? staff.getStaffId() : "UNASSIGNED";
                    String staffName = staff != null ? staff.getName() : "Unassigned";
                    LocalDateTime cycleEnd = task.getCreatedAt();

                    // filter criterion 1: staff (optional)
                    boolean staffMatches = filterStaffId == null || filterStaffId.isBlank()
                            || filterStaffId.equals(staffId);

                    // filter criterion 2: completion date range (optional) - combined with criterion 1
                    boolean withinRange = (rangeStart == null || !cycleEnd.isBefore(rangeStart))
                            && (rangeEnd == null || !cycleEnd.isAfter(rangeEnd));

                    if (staffMatches && withinRange) {
                        long minutes = Duration.between(cycleStart, cycleEnd).toMinutes();

                        if (count < temp.length) {
                            temp[count] = new StaffTurnaroundDTO(
                                    room.getRoomId(), staffId, staffName, cycleStart, cycleEnd, minutes);
                            count++;
                        }
                    }
                    cycleStart = null;
                }
            }
        }

        StaffTurnaroundDTO[] result = new StaffTurnaroundDTO[count];
        for (int i = 0; i < count; i++) {
            result[i] = temp[i];
        }

        bubbleSortByDurationAsc(result);
        return result;
    }

    private void bubbleSortByDurationAsc(StaffTurnaroundDTO[] arr) {
        for (int i = 0; i < arr.length - 1; i++) {
            for (int j = 0; j < arr.length - 1 - i; j++) {
                if (arr[j].getDurationMinutes() > arr[j + 1].getDurationMinutes()) {
                    StaffTurnaroundDTO t = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = t;
                }
            }
        }
    }
}