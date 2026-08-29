package com.tarumt.tarumt_resorts.control;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.tarumt.tarumt_resorts.adt.MyList;
import com.tarumt.tarumt_resorts.dao.BookingDAO;
import com.tarumt.tarumt_resorts.dao.HousekeepingTaskDAO;
import com.tarumt.tarumt_resorts.dao.RoomDAO;
import com.tarumt.tarumt_resorts.dto.RoomStatusSummaryDTO;
import com.tarumt.tarumt_resorts.dto.StaffTurnaroundDTO;
import com.tarumt.tarumt_resorts.entity.Booking;
import com.tarumt.tarumt_resorts.entity.HousekeepingTask;
import com.tarumt.tarumt_resorts.entity.Room;
import com.tarumt.tarumt_resorts.entity.Staff;
import com.tarumt.tarumt_resorts.utility.SortingUtil;
import com.tarumt.tarumt_resorts.entity.enums.BookingStatus;
import com.tarumt.tarumt_resorts.entity.enums.HousekeepingStatus;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
public class ReportControl {

    // Ter Kean Sen: Guest Search Reports
    private final BookingDAO bookingDAO;

    // Inject dependencies for Housekeeping Reports
    private final RoomDAO roomDAO;
    private final HousekeepingTaskDAO taskDAO;
    private final HousekeepingControl hkControl;

    public ReportControl(BookingDAO bookingDAO, RoomDAO roomDAO, HousekeepingTaskDAO taskDAO, HousekeepingControl hkControl) {
        this.bookingDAO = bookingDAO;
        this.roomDAO = roomDAO;
        this.taskDAO = taskDAO;
        this.hkControl = hkControl;
    }

    public Booking[] generateArrivalDepartureReport() {
        String today = java.time.LocalDate.now().toString();
        return bookingDAO.findTodayArrivalAndDeparture(today);
    }

    public Booking[] generateGuestDirectoryReport() {
        return bookingDAO.findByStatus(BookingStatus.CHECKED_IN);
    }
    
    // Lew Chun Hoe: Walk-In Registration Reports
    public String generateWalkInSummaryReport(){
        return new String();
    }

    public String generateRegistrationCancellationReport(){
        return new String();
    }

    // See Wei Jian: Housekeeping Task Logs Reports
    public RoomStatusSummaryDTO[] generateHousekeepingStatusReport(String filterStatus, Long minMinutesWaiting) {
        MyList<Room> allRooms = SortingUtil.toMyList(roomDAO.findAll());
        RoomStatusSummaryDTO[] temp = new RoomStatusSummaryDTO[allRooms.size()];
        int count = 0;

        for (int i = 0; i < allRooms.size(); i++) {
            Room room = allRooms.get(i);
            
            // Re-use the smart lazy-sync logic from your original code
            HousekeepingStatus stage = hkControl.syncAndGetCurrentStage(room);

            // Fetch tasks and sort DESCENDING to get the latest task's time
            MyList<HousekeepingTask> unsortedTasks = SortingUtil.toMyList(taskDAO.findByRoom_RoomId(room.getRoomId()));
            HousekeepingTask[] sortedDesc = SortingUtil.sortTasksByDate(unsortedTasks, true);
            
            LocalDateTime since = sortedDesc.length == 0 ? room.getCreatedAt() : sortedDesc[0].getCreatedAt();
            long minutes = Duration.between(since, LocalDateTime.now()).toMinutes();

            if (filterStatus != null && !filterStatus.isBlank() && !stage.name().equalsIgnoreCase(filterStatus)) continue;
            if (minMinutesWaiting != null && minutes < minMinutesWaiting) continue;

            temp[count++] = new RoomStatusSummaryDTO(
                    room.getRoomId(), stage, hkControl.nextStatus(stage), 
                    minutes, hkControl.canRollback(room.getRoomId())
            );
        }

        RoomStatusSummaryDTO[] result = new RoomStatusSummaryDTO[count];
        System.arraycopy(temp, 0, result, 0, count);

        SortingUtil.bubbleSortByMinutesDesc(result);
        return result;
    }

    public StaffTurnaroundDTO[] generateCleaningTurnaroundReport(String filterStaffId, LocalDateTime rangeStart, LocalDateTime rangeEnd) {
        MyList<Room> allRooms = SortingUtil.toMyList(roomDAO.findAll());
        StaffTurnaroundDTO[] temp = new StaffTurnaroundDTO[500];
        int count = 0;

        for (int r = 0; r < allRooms.size(); r++) {
            Room room = allRooms.get(r);
            MyList<HousekeepingTask> unsortedTasks = SortingUtil.toMyList(taskDAO.findByRoom_RoomId(room.getRoomId()));
            
            HousekeepingTask[] history = SortingUtil.sortTasksByDate(unsortedTasks, false);
            LocalDateTime cycleStart = null;

            for (HousekeepingTask task : history) {
                if (task.getCurrentStatus() == HousekeepingStatus.DIRTY && cycleStart == null) {
                    cycleStart = task.getCreatedAt();
                } else if (task.getCurrentStatus() == HousekeepingStatus.READY_FOR_CHECKIN && cycleStart != null) {
                    Staff staff = task.getStaff();
                    String staffId = staff != null ? staff.getStaffId() : "UNASSIGNED";
                    String staffName = staff != null ? staff.getName() : "Unassigned";
                    
                    boolean staffMatches = false;
                    if (filterStaffId == null || filterStaffId.isBlank()) {
                        staffMatches = true;
                    } else {
                        String query = filterStaffId.toLowerCase().trim();
                        staffMatches = staffId.toLowerCase().contains(query) 
                                    || staffName.toLowerCase().contains(query);
                    }

                    boolean withinRange = (rangeStart == null || !task.getCreatedAt().isBefore(rangeStart))
                                       && (rangeEnd == null || !task.getCreatedAt().isAfter(rangeEnd));

                    if (staffMatches && withinRange && count < temp.length) {
                        long minutes = Duration.between(cycleStart, task.getCreatedAt()).toMinutes();
                        temp[count++] = new StaffTurnaroundDTO(
                                room.getRoomId(), staffId, staffName, 
                                cycleStart, task.getCreatedAt(), minutes);
                    }
                    cycleStart = null;
                }
            }
        }

        StaffTurnaroundDTO[] result = new StaffTurnaroundDTO[count];
        System.arraycopy(temp, 0, result, 0, count);

        SortingUtil.bubbleSortByDurationAsc(result);
        return result;
    }

    // Tek Shao Xian: Loyalty & Members Reports
    public String generateMemberPointsReport(){
        return new String();
    }

    public String generateRedemptionRecordReport(){
        return new String();
    }
}
