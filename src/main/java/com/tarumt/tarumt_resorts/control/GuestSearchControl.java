package com.tarumt.tarumt_resorts.control;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tarumt.tarumt_resorts.dao.BookingDAO;
import com.tarumt.tarumt_resorts.entity.Booking;

@Service
public class GuestSearchControl {
    @Autowired
    private BookingDAO bookingDao;

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
