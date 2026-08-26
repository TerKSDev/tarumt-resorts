// LEW CHUN HOE
package com.tarumt.tarumt_resorts.boundary;

import com.tarumt.tarumt_resorts.control.RegistrationControl;
import com.tarumt.tarumt_resorts.control.RegistrationControl.QueueItem;
import com.tarumt.tarumt_resorts.entity.Booking;
import com.tarumt.tarumt_resorts.entity.enums.CancellationReason;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/registration/queue")
@CrossOrigin(
    origins = {"http://localhost:5173", "http://127.0.0.1:5173"},
    allowedHeaders = "*",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS}
)
public class RegistrationBoundary {

    private final RegistrationControl registrationControl;

    public RegistrationBoundary(RegistrationControl registrationControl) {
        this.registrationControl = registrationControl;
    }

    @GetMapping
    public ResponseEntity<QueueItem[]> getQueue() {
        return ResponseEntity.ok(registrationControl.getQueue());
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerGuest(@RequestBody QueueItem request) {
        try {
            return ResponseEntity.ok(registrationControl.enqueueGuest(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/assign-room/{queueId}")
    public ResponseEntity<?> assignRoom(@PathVariable String queueId) {
        try {
            Booking booking = registrationControl.processGuestById(queueId);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/cancel/{queueId}")
    public ResponseEntity<?> cancelGuest(@PathVariable String queueId, @RequestBody Map<String, String> request) {
        try {
            CancellationReason reason = CancellationReason.valueOf(request.get("reason"));
            Booking booking = registrationControl.cancelGuestById(queueId, reason);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}