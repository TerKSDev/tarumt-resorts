// Ter Kean Sen
package com.tarumt.tarumt_resorts.control;

import org.springframework.stereotype.Service;

import com.tarumt.tarumt_resorts.dao.BookingDAO;
import com.tarumt.tarumt_resorts.entity.Booking;
import com.tarumt.tarumt_resorts.adt.HashedDictionary;

@Service
public class GuestSearchControl {
    // Dependency Injection
    private final BookingDAO bookingDao;

    // Custom ADT Application: Dictionary (Map / HashMap)
    // Use custom HashedDictionary to cache searched bookings.
    // Allows O(1) retrieval for repeated searches, saving database calls.
    private final HashedDictionary<String, Booking> searchCache;

    public GuestSearchControl(BookingDAO bookingDao) {
        this.bookingDao = bookingDao;
        // Initialize with a prime number size as recommended by your ADT comments
        this.searchCache = new HashedDictionary<>(31); 
    }

    // Core Logic for Frontend Request
    public Booking searchGuestBooking(String confirmationNo) {
        try {
            // ADT Cache Check: If already searched before, get it directly from the Dictionary
            if (searchCache.contains(confirmationNo)) {
                System.out.println("Cache Hit for: " + confirmationNo);
                return searchCache.getValue(confirmationNo);
            }

            // Cache Miss: Fetch from the database
            System.out.println("Cache Miss, fetching from DB for: " + confirmationNo);
            Booking booking = bookingDao.findByConfirmationNo(confirmationNo);
            
            // Store in ADT: Save it to our Dictionary for next time
            if (booking != null) {
                // Basic cache eviction: if dictionary gets full, clear it to avoid memory leak
                if (searchCache.getSize() >= 25) {
                    searchCache.clear();
                }
                searchCache.add(confirmationNo, booking);
            }
            
            return booking;
        } catch (Exception e) {
            System.out.println("Error occurred when fetching guest data: " + e.getMessage());
            return null;
        }
    }
}
