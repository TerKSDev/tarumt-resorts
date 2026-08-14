package com.tarumt.tarumt_resorts.control;

import org.springframework.stereotype.Service;

import com.tarumt.tarumt_resorts.dao.BookingDAO;
import com.tarumt.tarumt_resorts.entity.Booking;
import com.tarumt.tarumt_resorts.entity.enums.BookingStatus;

@Service
public class ReportControl {

    // Ter Kean Sen: Guest Search Reports
    private final BookingDAO bookingDAO;

    public ReportControl(BookingDAO bookingDAO) {
        this.bookingDAO = bookingDAO;
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
