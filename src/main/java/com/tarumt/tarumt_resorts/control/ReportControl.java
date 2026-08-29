package com.tarumt.tarumt_resorts.control;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import com.tarumt.tarumt_resorts.adt.MyArrayList;
import com.tarumt.tarumt_resorts.adt.MyList;
import com.tarumt.tarumt_resorts.dao.BookingDAO;
import com.tarumt.tarumt_resorts.dto.CancellationReasonDTO;
import com.tarumt.tarumt_resorts.dto.CancellationTrendDTO;
import com.tarumt.tarumt_resorts.dto.RegistrationCancellationReportDTO;
import com.tarumt.tarumt_resorts.dto.WalkInSummaryDTO;
import com.tarumt.tarumt_resorts.entity.Booking;
import com.tarumt.tarumt_resorts.entity.HousekeepingTask;
import com.tarumt.tarumt_resorts.entity.Room;
import com.tarumt.tarumt_resorts.entity.Staff;
import com.tarumt.tarumt_resorts.utility.SortingUtil;
import com.tarumt.tarumt_resorts.entity.enums.BookingStatus;
import com.tarumt.tarumt_resorts.adt.MyQueue;
import com.tarumt.tarumt_resorts.adt.MyArrayQueue;

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
        Booking[] bookings = bookingDAO.findTodayArrivalAndDeparture(today);

        // --- Custom ADT Application: MyQueue (FIFO) ---
        // Using the custom MyArrayQueue ADT implemented for the project
        MyQueue<Booking> arrivalQueue = new MyArrayQueue<>();
        MyQueue<Booking> departureQueue = new MyArrayQueue<>();

        // Categorize into the respective Queues
        for (Booking b : bookings) {
            if (b.getCheckInDate() != null && b.getCheckInDate().equals(today)) {
                arrivalQueue.enqueue(b); // Enqueue arriving guests
            } else if (b.getCheckOutDate() != null && b.getCheckOutDate().equals(today)) {
                departureQueue.enqueue(b); // Enqueue departing guests
            }
        }

        // Process Queues and combine them back into an ordered Report array 
        // Priority is given to Arrival guests first, then Departure guests
        Booking[] sortedReport = new Booking[bookings.length];
        int index = 0;
        
        while (arrivalQueue.size() > 0) {
            sortedReport[index++] = arrivalQueue.removeAt(0); // Dequeue (FIFO)
        }
        while (departureQueue.size() > 0) {
            sortedReport[index++] = departureQueue.removeAt(0); // Dequeue (FIFO)
        }

        return sortedReport;
    }

    public Booking[] generateGuestDirectoryReport() {
        return bookingDAO.findByStatus(BookingStatus.CHECKED_IN);
    }
    
    // Lew Chun Hoe: Walk-In Registration Reports
    // Uses the explicit isWalkIn flag set at check-in time, instead of inferring from dates
    public WalkInSummaryDTO generateWalkInSummaryReport(){
        String today = java.time.LocalDate.now().toString();
        Booking[] todaysRegistrations = bookingDAO.findByCreatedDate(today);

        MyList<Booking> walkIns = new MyArrayList<>();
        BigDecimal totalRevenue = BigDecimal.ZERO;
        for (Booking booking : todaysRegistrations) {
            if (Boolean.TRUE.equals(booking.getIsWalkIn())) {
                walkIns.add(booking);
                totalRevenue = totalRevenue.add(booking.getTotalAmount());
            }
        }

        Booking[] walkInBookings = new Booking[walkIns.size()];
        for (int i = 0; i < walkIns.size(); i++) {
            walkInBookings[i] = walkIns.get(i);
        }

        return new WalkInSummaryDTO(today, walkInBookings.length, totalRevenue, walkInBookings);
    }

    public RegistrationCancellationReportDTO generateRegistrationCancellationReport(){
        Booking[] cancelledBookings = bookingDAO.findByStatus(BookingStatus.CANCELLED);
        long totalBookings = bookingDAO.count();

        BigDecimal totalLostRevenue = BigDecimal.ZERO;
        MyList<CancellationTrendDTO> trends = new MyArrayList<>();
        MyList<CancellationReasonDTO> reasonBreakdown = new MyArrayList<>();

        for (Booking booking : cancelledBookings) {
            totalLostRevenue = totalLostRevenue.add(booking.getTotalAmount());

            // Group by the month the cancellation was recorded (updated_at)
            String period = String.format("%04d-%02d", booking.getUpdatedAt().getYear(), booking.getUpdatedAt().getMonthValue());

            CancellationTrendDTO matchingTrend = null;
            for (int i = 0; i < trends.size(); i++) {
                if (trends.get(i).getPeriod().equals(period)) {
                    matchingTrend = trends.get(i);
                    break;
                }
            }

            if (matchingTrend != null) {
                matchingTrend.addCancellation(booking.getTotalAmount());
            } else {
                trends.add(new CancellationTrendDTO(period, booking.getTotalAmount()));
            }

            // Group by cancellation reason for trend/root-cause analysis
            var reason = booking.getCancellationReason();
            if (reason != null) {
                CancellationReasonDTO matchingReason = null;
                for (int i = 0; i < reasonBreakdown.size(); i++) {
                    if (reasonBreakdown.get(i).getReason() == reason) {
                        matchingReason = reasonBreakdown.get(i);
                        break;
                    }
                }

                if (matchingReason != null) {
                    matchingReason.addCancellation(booking.getTotalAmount());
                } else {
                    reasonBreakdown.add(new CancellationReasonDTO(reason, booking.getTotalAmount()));
                }
            }
        }

        CancellationTrendDTO[] trendArray = new CancellationTrendDTO[trends.size()];
        for (int i = 0; i < trends.size(); i++) {
            trendArray[i] = trends.get(i);
        }

        CancellationReasonDTO[] reasonArray = new CancellationReasonDTO[reasonBreakdown.size()];
        for (int i = 0; i < reasonBreakdown.size(); i++) {
            reasonArray[i] = reasonBreakdown.get(i);
        }

        double cancellationRate = totalBookings == 0 ? 0.0 : (double) cancelledBookings.length / totalBookings * 100;

        return new RegistrationCancellationReportDTO(cancelledBookings.length, totalLostRevenue, cancellationRate,
                trendArray, reasonArray, cancelledBookings);
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
