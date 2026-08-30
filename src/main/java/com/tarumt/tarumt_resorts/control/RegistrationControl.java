package com.tarumt.tarumt_resorts.control;

import com.tarumt.tarumt_resorts.dao.BookingDAO;
import com.tarumt.tarumt_resorts.dao.CustomerDAO;
import com.tarumt.tarumt_resorts.entity.Booking;
import com.tarumt.tarumt_resorts.entity.Customer;
import com.tarumt.tarumt_resorts.entity.enums.BookingStatus;
import com.tarumt.tarumt_resorts.entity.enums.CancellationReason;
import com.tarumt.tarumt_resorts.entity.enums.LoyaltyTier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.tarumt.tarumt_resorts.adt.Queue;
import com.tarumt.tarumt_resorts.adt.interfaces.QueueInterface;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID; // ✅

/**
 * Registration Control Layer (ECB Pattern)
 * 
 * Manages walk-in guest registration using a custom FIFO queue ADT (MyArrayQueue).
 * 
 * Key Features:
 * - In-memory queue for active registrations (temporary storage)
 * - Database persistence for Customer & Booking entities
 * - Duplicate prevention: Identity number validated against queue and database
 * - Support for full registration or cancellation workflows
 * 
 * Business Logic:
 * 1. enqueueGuest() → Validates and adds guest to FIFO queue
 * 2. processGuestById() → Removes from queue, creates/updates Customer, creates Booking
 * 3. cancelGuestById() → Removes from queue, records cancellation with reason
 * 4. getQueue() → Snapshots current queue state for display
 */
@Service
public class RegistrationControl {

    private static final int DEFAULT_CAPACITY = 16;

    private final CustomerDAO customerRepository;
    private final BookingDAO bookingRepository;

    // In-memory FIFO queue ADT (custom implementation, NOT java.util.Queue)
    private final QueueInterface<QueueItem> queue;

    public RegistrationControl(CustomerDAO customerRepository, BookingDAO bookingRepository) {
        this.customerRepository = customerRepository;
        this.bookingRepository = bookingRepository;
        this.queue = new Queue<>(DEFAULT_CAPACITY);
    }

    // Inner Class representing temporary queue memory item.
    // NOTE: identityNo is only ever held here, in the in-memory queue — the
    // customers table no longer has an identity_no column, so it's never
    // persisted onto a Customer entity. It's still useful for stopping the
    // same person being queued twice (see enqueueGuest below).
    public static class QueueItem {
        private String id;
        private String name;
        private String identityNo;
        private int guests;
        private LocalDateTime checkIn;

        public QueueItem() {}

        public QueueItem(String id, String name, String identityNo, int guests) {
            this.id = id;
            this.name = name;
            this.identityNo = identityNo;
            this.guests = guests;
            this.checkIn = LocalDateTime.now();
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getIdentityNo() { return identityNo; }
        public void setIdentityNo(String identityNo) { this.identityNo = identityNo; }

        public int getGuests() { return guests; }
        public void setGuests(int guests) { this.guests = guests; }

        public LocalDateTime getCheckIn() { return checkIn; }
        public void setCheckIn(LocalDateTime checkIn) { this.checkIn = checkIn; }
    }

    /**
     * Enqueue Guest to Registration Queue
     * 
     * Validates and adds guest to FIFO queue.
     * 
     * Validation Steps:
     * 1. Request payload is not null
     * 2. Identity number is not blank
     * 3. Identity number is NOT already in queue (prevents duplicate queuing)
     * 4. Identity number is NOT already in Customer database (prevents duplicate accounts)
     * 
     * If all validations pass:
     * - Generates unique queue ID (UUID)
     * - Normalizes identity number (trim, uppercase)
     * - Sets arrival time to NOW
     * - Adds to FIFO queue
     * 
     * @param item QueueItem with name, identityNo, guests count
     * @return QueueItem with auto-generated id and checkIn timestamp
     * @throws IllegalArgumentException if validation fails
     */
    public QueueItem enqueueGuest(QueueItem item) {
        if (item == null) {
            throw new IllegalArgumentException("Registration payload is required.");
        }

        String normalizedIdentityNo = item.getIdentityNo() == null
            ? ""
            : item.getIdentityNo().trim();

        if (normalizedIdentityNo.isBlank()) {
            throw new IllegalArgumentException("Identity number is required.");
        }

        // Only checked against the current in-memory queue — the customers
        // table has no identity_no column anymore, so there's no way to
        // check this against past/existing customers, only against people
        // currently waiting in line.
        boolean foundIdentity = false;
        for (int i = 0; i < queue.size(); i++) {
            if (normalizedIdentityNo.equalsIgnoreCase(queue.get(i).getIdentityNo())) {
                foundIdentity = true;
                break;
            }
        }
        if (foundIdentity) {
            throw new IllegalArgumentException("This identity number is already in the queue.");
        }

        item.setId(UUID.randomUUID().toString());
        item.setIdentityNo(normalizedIdentityNo);
        item.setName(item.getName() == null ? "" : item.getName().trim());
        item.setCheckIn(LocalDateTime.now());

        queue.enqueue(item);
        return item;
    }

    /**
     * Get Snapshot of Current Queue
     * 
     * Returns array of all QueueItems currently in queue (FIFO order).
     * This is a safe snapshot - modifications to returned array don't affect internal queue.
     * 
     * Used by:
     * - Dashboard to display waiting guests list
     * - Staff UI to see next guest to process
     * 
     * @return Array of QueueItem objects in FIFO order (oldest first)
     */
    public QueueItem[] getQueue() {
        Object[] raw = queue.snapshot();
        QueueItem[] list = new QueueItem[raw.length];
        for (int i = 0; i < raw.length; i++) {
            list[i] = (QueueItem) raw[i];
        }
        return list;
    }

    /**
     * Process Guest (Assign Room & Complete Registration)
     * 
     * Removes guest from queue and persists to database:
     * 
     * Workflow:
     * 1. Locate guest by queue ID (must exist in queue)
     * 2. Remove from queue (DEQUEUE operation)
     * 3. Check if Customer exists by identity number:
     *    - If NEW: Create Customer with BRONZE loyalty tier
     *    - If EXISTS: Update existing customer record
     * 4. Create Booking entity:
     *    - Set Customer reference
     *    - Generate confirmation number
     *    - Mark as WALK_IN and ACTIVE
     *    - Initialize default total amount (150.00)
     * 5. Persist both Customer and Booking to database
     * 
     * @Transactional ensures atomicity - either both entities save or both rollback
     * 
     * @param queueId UUID of guest in queue
     * @return Booking entity with confirmation number
     * @throws IllegalArgumentException if queueId not found or invalid
     */
    @Transactional
    public Booking processGuestById(String queueId) {
        if (queueId == null || queueId.isBlank()) {
            throw new IllegalArgumentException("Queue item id is required.");
        }

        int selectedIndex = -1;
        for (int i = 0; i < queue.size(); i++) {
            if (queueId.equals(queue.get(i).getId())) {
                selectedIndex = i;
                break;
            }
        }
        
        if (selectedIndex < 0) {
            throw new IllegalArgumentException("Selected guest was not found in the queue.");
        }

        QueueItem selectedItem = queue.get(selectedIndex);
        queue.removeAt(selectedIndex);

        LocalDateTime now = LocalDateTime.now();

        // The customers table has no identity_no column to look up an
        // existing customer by, so every processed guest becomes a new
        // Customer record — there's no reliable way left to detect a
        // returning guest.
        Customer newCustomer = new Customer();
        newCustomer.setName(selectedItem.getName() == null ? "" : selectedItem.getName().trim());
        newCustomer.setLoyaltyTier(LoyaltyTier.BRONZE);
        newCustomer.setCreatedAt(now);
        newCustomer.setUpdatedAt(now);
        newCustomer.setIsActive(true);
        Customer customer = customerRepository.save(newCustomer);

        // Create and persist Booking entity
        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setConfirmationNo(generateConfirmationNumber());
        booking.setCheckInDate(now);
        booking.setCheckOutDate(null);
        booking.setTotalAmount(BigDecimal.valueOf(150.00));
        booking.setIsPaid(true);
        booking.setStatus(BookingStatus.ACTIVE);
        booking.setIsWalkIn(true);
        booking.setCreatedAt(now);
        booking.setUpdatedAt(now);

        return bookingRepository.save(booking);
    }

    /**
     * Cancel Guest Registration
     * 
     * Removes guest from queue and records cancellation in database.
     * Useful for tracking why guests don't complete check-in.
     * 
     * Workflow:
     * 1. Validate queue ID and cancellation reason
     * 2. Locate guest by queue ID (must exist in queue)
     * 3. Remove from queue (DEQUEUE operation)
     * 4. Check if Customer exists by identity number:
     *    - If NEW: Create Customer with BRONZE loyalty tier
     *    - If EXISTS: Update existing customer record
     * 5. Create Booking entity:
     *    - Set Customer reference
     *    - Generate confirmation number
     *    - Mark as CANCELLED with provided reason
     *    - Initialize same details as processGuestById but with CANCELLED status
     * 6. Persist both Customer and Booking to database
     * 
     * Cancellation Reasons:
     * - GUEST_REQUEST: Guest voluntarily cancels
     * - DUPLICATE_ENTRY: Guest already exists or duplicate registration
     * - NO_SHOW: Guest doesn't appear for check-in
     * - PAYMENT_ISSUE: Payment cannot be processed
     * - OTHER: Miscellaneous reasons
     * 
     * @Transactional ensures atomicity
     * 
     * @param queueId UUID of guest in queue
     * @param reason CancellationReason enum value
     * @return Booking entity with CANCELLED status and reason
     * @throws IllegalArgumentException if queueId not found or reason invalid
     */
    @Transactional
    public Booking cancelGuestById(String queueId, CancellationReason reason) {
        if (queueId == null || queueId.isBlank()) {
            throw new IllegalArgumentException("Queue item id is required.");
        }
        if (reason == null) {
            throw new IllegalArgumentException("Cancellation reason is required.");
        }

        int selectedIndex = -1;
        for (int i = 0; i < queue.size(); i++) {
            if (queueId.equals(queue.get(i).getId())) {
                selectedIndex = i;
                break;
            }
        }

        if (selectedIndex < 0) {
            throw new IllegalArgumentException("Selected guest was not found in the queue.");
        }

        QueueItem selectedItem = queue.get(selectedIndex);
        queue.removeAt(selectedIndex);

        LocalDateTime now = LocalDateTime.now();

        Customer newCustomer = new Customer();
        newCustomer.setName(selectedItem.getName() == null ? "" : selectedItem.getName().trim());
        newCustomer.setLoyaltyTier(LoyaltyTier.BRONZE);
        newCustomer.setCreatedAt(now);
        newCustomer.setUpdatedAt(now);
        newCustomer.setIsActive(true);
        Customer customer = customerRepository.save(newCustomer);

        // Record the abandoned registration as a cancelled booking for reporting
        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setConfirmationNo(generateConfirmationNumber());
        booking.setCheckInDate(selectedItem.getCheckIn());
        booking.setCheckOutDate(null);
        booking.setTotalAmount(BigDecimal.valueOf(150.00));
        booking.setIsPaid(false);
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setIsWalkIn(true);
        booking.setCancellationReason(reason);
        booking.setCreatedAt(now);
        booking.setUpdatedAt(now);

        return bookingRepository.save(booking);
    }

    private String generateConfirmationNumber() {
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}