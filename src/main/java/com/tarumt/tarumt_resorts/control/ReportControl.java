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
import com.tarumt.tarumt_resorts.entity.enums.BookingStatus;
import com.tarumt.tarumt_resorts.adt.MyQueue;
import com.tarumt.tarumt_resorts.adt.MyArrayQueue;

@Service
public class ReportControl {

    // Ter Kean Sen: Guest Search Reports
    private final BookingDAO bookingDAO;

    public ReportControl(BookingDAO bookingDAO) {
        this.bookingDAO = bookingDAO;
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
    public String generateCleaningTurnaroundReport(){
        return new String();
    }

    public String generateHousekeepingStatusReport(){
        return new String();
    }

    // Tek Shao Xian: Loyalty & Members Reports
    public String generateMemberPointsReport(){
        return new String();
    }

    public String generateRedemptionRecordReport(){
        return new String();
    }
}
