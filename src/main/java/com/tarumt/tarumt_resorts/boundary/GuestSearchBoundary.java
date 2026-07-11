package com.tarumt.tarumt_resorts.boundary;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tarumt.tarumt_resorts.entity.Customer;

@RestController
@RequestMapping("api/guest-search")
@CrossOrigin(origins = "http://localhost:5173")
public class GuestSearchBoundary {
    @GetMapping("/{confirmationNo}")
    public ResponseEntity<Customer> getBooking(@PathVariable String confirmationNo) {
        if (confirmationNo.matches("[0-9]{8}")) {
            return ResponseEntity.ok(new Customer());
        }
        return ResponseEntity.notFound().build();
    }
}
