// Ter Kean Sen
package com.tarumt.tarumt_resorts.boundary;

import com.tarumt.tarumt_resorts.control.GuestSearchControl;
import com.tarumt.tarumt_resorts.entity.Booking;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/guest-search")
@CrossOrigin(origins = "http://localhost:5173")
public class GuestSearchBoundary {
    // Dependency Injection
    private final GuestSearchControl guestSearchControl;
    
    public GuestSearchBoundary(GuestSearchControl guestSearchControl) {
        this.guestSearchControl = guestSearchControl;
    }

    // Execute Frontend Request
    @GetMapping("/{confirmationNo}")

    // Verification and Enquiry
    public ResponseEntity<Booking> getBooking(@PathVariable String confirmationNo) {
        if (confirmationNo.matches("[0-9]{8}")) {
            Booking booking = guestSearchControl.searchGuestBooking(confirmationNo);
            if (booking != null) {
                return ResponseEntity.ok(booking);
            }
        }
        return ResponseEntity.notFound().build();
    }
}
