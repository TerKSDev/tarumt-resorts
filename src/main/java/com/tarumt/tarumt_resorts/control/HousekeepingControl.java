package com.tarumt.tarumt_resorts.control;

import com.tarumt.tarumt_resorts.adt.MyLinkedStack;
import com.tarumt.tarumt_resorts.adt.MyList;
import com.tarumt.tarumt_resorts.dao.HousekeepingTaskDAO;
import com.tarumt.tarumt_resorts.dao.RoomDAO;
import com.tarumt.tarumt_resorts.dao.StaffDAO;
import com.tarumt.tarumt_resorts.entity.HousekeepingTask;
import com.tarumt.tarumt_resorts.entity.Room;
import com.tarumt.tarumt_resorts.entity.Staff;
import com.tarumt.tarumt_resorts.entity.enums.HousekeepingStatus;
import com.tarumt.tarumt_resorts.entity.enums.RoomStatus;
import com.tarumt.tarumt_resorts.utility.SortingUtil;
import com.tarumt.tarumt_resorts.utility.RoomStackRegistry;

import org.springframework.stereotype.Service;

/**
 * Author: See Wei Jian
 */
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

    private final RoomStackRegistry stackRegistry = new RoomStackRegistry();

    private static final HousekeepingStatus[] STATUS_FLOW = {
        HousekeepingStatus.DIRTY,
        HousekeepingStatus.CLEANING_INPROGRESS,
        HousekeepingStatus.INSPECTING,
        HousekeepingStatus.READY_FOR_CHECKIN
    };


    public MyList<Room> getAllRooms() {
        return SortingUtil.toMyList(roomDAO.findAll());
    }

    private RoomStatus toRoomStatus(HousekeepingStatus hk) {
        switch (hk) {
            case DIRTY:
            case CLEANING_INPROGRESS:
            case INSPECTING:
                return RoomStatus.CLEANING;
            case READY_FOR_CHECKIN:
                return RoomStatus.AVAILABLE;
            default:
                return RoomStatus.CLEANING;
        }
    }

    // For ReportControl access
    public HousekeepingStatus nextStatus(HousekeepingStatus current) {
        for (int i = 0; i < STATUS_FLOW.length - 1; i++) {
            if (STATUS_FLOW[i] == current) {
                return STATUS_FLOW[i + 1];
            }
        }
        return null;
    }

    private String occupancyBlockReason(Room room) {
        if (room.getStatus() == RoomStatus.RESERVED || room.getStatus() == RoomStatus.CHECKED_IN) {
            return "occupied by a guest";
        }
        if (room.getStatus() == RoomStatus.MAINTENANCE) {
            return "under maintenance";
        }
        return null; 
    }

    // For ReportControl access
    public HousekeepingStatus syncAndGetCurrentStage(Room room) {
        // Extract the latest task in descending order using a hand-written Insertion Sort.
        MyList<HousekeepingTask> unsortedTasks = SortingUtil.toMyList(taskDAO.findByRoom_RoomId(room.getRoomId()));
        HousekeepingTask[] sortedDesc = SortingUtil.sortTasksByDate(unsortedTasks, true);
        
        HousekeepingTask latest = sortedDesc.length > 0 ? sortedDesc[0] : null;
        HousekeepingStatus latestStage = latest != null ? latest.getCurrentStatus() : HousekeepingStatus.DIRTY;

        if (room.getStatus() == RoomStatus.CHECKED_OUT) {
            boolean alreadyFinishedPreviousCycle = latest != null
                    && latestStage == HousekeepingStatus.READY_FOR_CHECKIN;

            boolean checkoutHappenedAfterThatCycle = room.getUpdatedAt() != null
                    && latest != null
                    && latest.getCreatedAt() != null
                    && room.getUpdatedAt().isAfter(latest.getCreatedAt());

            boolean needsNewCycle = latest == null
                    || (alreadyFinishedPreviousCycle && checkoutHappenedAfterThatCycle);

            if (needsNewCycle) {
                HousekeepingTask autoTask = new HousekeepingTask();
                autoTask.setRoom(room);
                autoTask.setOldStatus(latest != null ? latest.getCurrentStatus() : null);
                autoTask.setCurrentStatus(HousekeepingStatus.DIRTY);
                autoTask.setRemarks("Auto: room checked out, new cleaning cycle started");
                HousekeepingTask saved = taskDAO.save(autoTask);

                stackRegistry.getStackFor(room.getRoomId()).push(saved);

                room.setStatus(toRoomStatus(HousekeepingStatus.DIRTY));
                roomDAO.save(room);

                return HousekeepingStatus.DIRTY;
            }
        }
        return latestStage;
    }

    // ---------------------------------------------------------------
    // Core operation 1: advance a room to the next sequential status
    // ---------------------------------------------------------------

    public String advanceRoomStatus(String roomId, String staffId, String remarks) {
        Room room = roomDAO.findById(roomId).orElse(null);
        if (room == null) return "Room not found!";

        String blockReason = occupancyBlockReason(room);
        if (blockReason != null) {
            return "Room " + roomId + " is " + blockReason + " - housekeeping cannot advance it.";
        }

        HousekeepingStatus currentStage = syncAndGetCurrentStage(room);
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
    // ---------------------------------------------------------------

    public String rollbackLastAction(String roomId) {
        MyLinkedStack<HousekeepingTask> stack = stackRegistry.getStackFor(roomId);
        if (stack.isEmpty()) return "No recent actions to rollback for room " + roomId + ".";

        // Re-fetch the room fresh (not lastTask.getRoom(), which reflects
        // whatever the Room looked like back when that task was saved -
        // Room Management may have changed its status since then).
        Room room = roomDAO.findById(roomId).orElse(null);
        if (room == null) return "Room not found!";

        String blockReason = occupancyBlockReason(room);
        if (blockReason != null) {
            return "Room " + roomId + " is " + blockReason + " - cannot rollback.";
        }

        HousekeepingTask lastTask = stack.pop();
        HousekeepingStatus statusToRestore = lastTask.getOldStatus();

        // If the popped action was the auto-generated DIRTY task from a
        // checkout, oldStatus may be null (there was nothing before it
        // in that fresh cycle) - fall back sensibly instead of crashing.
        RoomStatus restoredRoomStatus = statusToRestore != null
                ? toRoomStatus(statusToRestore)
                : room.getStatus();

        room.setStatus(restoredRoomStatus);
        roomDAO.save(room);

        // audit trail: log the rollback itself (not pushed back onto the stack,
        // so a rollback cannot itself be "un-rolled-back")
        HousekeepingTask rollbackTask = new HousekeepingTask();
        rollbackTask.setRoom(room);
        rollbackTask.setOldStatus(lastTask.getCurrentStatus());
        rollbackTask.setCurrentStatus(statusToRestore);
        rollbackTask.setRemarks("System Rollback");
        taskDAO.save(rollbackTask);

        return "Rolled back room " + room.getRoomId() + " to "
                + (statusToRestore != null ? statusToRestore : "its previous state");
    }

    public boolean canRollback(String roomId) {
        Room room = roomDAO.findById(roomId).orElse(null);
        if (room == null || occupancyBlockReason(room) != null) {
            return false;
        }
        return !stackRegistry.getStackFor(roomId).isEmpty();
    }
}