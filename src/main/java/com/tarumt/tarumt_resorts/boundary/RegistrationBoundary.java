// LEW CHUN HOE
package com.tarumt.tarumt_resorts.boundary;

import com.tarumt.tarumt_resorts.control.RegistrationControl;
import com.tarumt.tarumt_resorts.control.RegistrationControl.QueueItem;
import com.tarumt.tarumt_resorts.dto.CancellationRequestDTO;
import com.tarumt.tarumt_resorts.dto.RoomAssignmentDTO;
import com.tarumt.tarumt_resorts.entity.Booking;
import com.tarumt.tarumt_resorts.entity.Room;
import com.tarumt.tarumt_resorts.entity.enums.CancellationReason;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Guest Registration & Queue Management API
 * 
 * Handles walk-in guest registration using a FIFO queue ADT.
 * Guests are enqueued for check-in, then processed (assigned rooms) or cancelled.
 * 
 * Workflow:
 * 1. Guest arrives → registerGuest() adds to queue
 * 2. Staff reviews queue → getQueue() shows waiting guests
 * 3. Staff processes guest → assignRoom() creates Booking & Customer records
 * 4. OR Staff cancels guest → cancelGuest() records cancellation reason
 */
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

    /**
     * GET all guests currently in the registration queue
     * Returns array of QueueItem (guest name, identity number, arrival time, etc)
     */
    @GetMapping
    public ResponseEntity<QueueItem[]> getQueue() {
        return ResponseEntity.ok(registrationControl.getQueue());
    }

    /**
     * POST new guest to registration queue
     * 
     * Validates:
     * - Identity number is not blank
     * - Identity number is not already in queue (prevents duplicate queuing)
     * - Identity number is not already a registered customer (prevents duplicate accounts)
     * 
     * On success: Returns QueueItem with auto-generated ID and timestamp
     * On failure: Returns error message with validation details
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerGuest(@RequestBody QueueItem request) {
        try {
            return ResponseEntity.ok(registrationControl.enqueueGuest(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * GET all available rooms for assignment
     * 
     * Returns array of Room entities with AVAILABLE status.
     * Staff uses this to select which room to assign to a guest.
     */
    @GetMapping("/available-rooms")
    public ResponseEntity<?> getAvailableRooms() {
        try {
            Room[] rooms = registrationControl.getAvailableRooms();
            return ResponseEntity.ok(rooms);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching available rooms: " + e.getMessage());
        }
    }

    /**
     * POST process (assign room) to guest in queue
     * 
     * Removes guest from queue and assigns a specific available room, then:
     * - Updates room status to RESERVED
     * - Creates Customer record
     * - Creates Booking entity with room assignment
     * - Sets guest as walk-in with ACTIVE status
     * 
     * Request body must include roomId of an AVAILABLE room.
     * 
     * On success: Returns Booking entity with confirmation number and assigned room
     * On failure: Returns error message (e.g., guest not found, room not available)
     */
    @PostMapping("/assign-room/{queueId}")
    public ResponseEntity<?> assignRoom(@PathVariable String queueId, @RequestBody RoomAssignmentDTO request) {
        try {
            if (request == null || request.getRoomId() == null || request.getRoomId().isBlank()) {
                return ResponseEntity.badRequest().body("Room ID is required.");
            }
            Booking booking = registrationControl.processGuestById(queueId, request.getRoomId());
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * POST cancel guest registration
     * 
     * Removes guest from queue and records cancellation reason.
     * Requires CancellationReason enum value: GUEST_REQUEST, DUPLICATE_ENTRY, NO_SHOW, PAYMENT_ISSUE, or OTHER
     * 
     * Creates Customer record (if new) and Booking with CANCELLED status.
     * Useful for tracking why guests didn't complete check-in.
     * 
     * On success: Returns Booking entity with cancellation status
     * On failure: Returns error message (invalid reason, guest not found, etc)
     */
    @PostMapping("/cancel/{queueId}")
    public ResponseEntity<?> cancelGuest(@PathVariable String queueId, @RequestBody CancellationRequestDTO request) {
        try {
            CancellationReason reason = CancellationReason.valueOf(request.getReason());
            Booking booking = registrationControl.cancelGuestById(queueId, reason);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}