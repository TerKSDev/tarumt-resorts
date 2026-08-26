package com.tarumt.tarumt_resorts.control;

import org.springframework.stereotype.Service;

import com.tarumt.tarumt_resorts.dao.BookingDAO;
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
    public String generateWalkInSummaryReport(){
        return new String();
    }

    public String generateRegistrationCancellationReport(){
        return new String();
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
