package com.tarumt.tarumt_resorts.control;

import org.springframework.stereotype.Service;

import com.tarumt.tarumt_resorts.dao.BookingDAO;
import com.tarumt.tarumt_resorts.entity.Booking;

@Service
public class GuestSearchControl {
    // Dependency Injection
    private final BookingDAO bookingDao;

    public GuestSearchControl(BookingDAO bookingDao) {
        this.bookingDao = bookingDao;
    }

    // Core Logic for Frontend Request
    public Booking searchGuestBooking(String confirmationNo) {
        try {
            Booking booking = bookingDao.findByConfirmationNo(confirmationNo);
            return booking;
        } catch (Exception e) {
            System.out.println("Error occurred when fetching guest data: " + e.getMessage());
            return null;
        }
    }
}
