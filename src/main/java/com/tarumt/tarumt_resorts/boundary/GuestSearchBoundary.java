package com.tarumt.tarumt_resorts.boundary;

import com.tarumt.tarumt_resorts.control.GuestSearchControl;
import com.tarumt.tarumt_resorts.entity.Booking;

import org.springframework.beans.factory.annotation.Autowired;
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
    @Autowired
    private GuestSearchControl guestSearchControl;

    @GetMapping("/{confirmationNo}")
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
