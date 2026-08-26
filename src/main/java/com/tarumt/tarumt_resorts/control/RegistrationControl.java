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
import com.tarumt.tarumt_resorts.adt.MyArrayQueue;
import com.tarumt.tarumt_resorts.adt.MyQueue;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID; // ✅

@Service
public class RegistrationControl {

    private static final int DEFAULT_CAPACITY = 16;

    private final CustomerDAO customerRepository;
    private final BookingDAO bookingRepository;

    // In-memory FIFO queue ADT (moved to utility)
    private final MyQueue<QueueItem> queue;

    public RegistrationControl(CustomerDAO customerRepository, BookingDAO bookingRepository) {
        this.customerRepository = customerRepository;
        this.bookingRepository = bookingRepository;
        this.queue = new MyArrayQueue<>(DEFAULT_CAPACITY);
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

    // Enqueue guest to waiting line
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
        if (queue.findIndex(q -> normalizedIdentityNo.equalsIgnoreCase(q.getIdentityNo())) != -1) {
            throw new IllegalArgumentException("This identity number is already in the queue.");
        }

        item.setId(UUID.randomUUID().toString());
        item.setIdentityNo(normalizedIdentityNo);
        item.setName(item.getName() == null ? "" : item.getName().trim());
        item.setCheckIn(LocalDateTime.now());

        queue.enqueue(item);
        return item;
    }

    // View current queue snapshot
    public QueueItem[] getQueue() {
        Object[] raw = queue.snapshot();
        QueueItem[] list = new QueueItem[raw.length];
        for (int i = 0; i < raw.length; i++) {
            list[i] = (QueueItem) raw[i];
        }
        return list;
    }

    // Dequeue selected guest by row ID and persist Customer and Booking entities to DB
    @Transactional
    public Booking processGuestById(String queueId) {
        if (queueId == null || queueId.isBlank()) {
            throw new IllegalArgumentException("Queue item id is required.");
        }

        int selectedIndex = queue.findIndex(q -> queueId.equals(q.getId()));
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

    // Dequeue selected guest by row ID and record the registration as cancelled
    @Transactional
    public Booking cancelGuestById(String queueId, CancellationReason reason) {
        if (queueId == null || queueId.isBlank()) {
            throw new IllegalArgumentException("Queue item id is required.");
        }
        if (reason == null) {
            throw new IllegalArgumentException("Cancellation reason is required.");
        }

        int selectedIndex = queue.findIndex(q -> queueId.equals(q.getId()));
        if (selectedIndex < 0) {
            throw new IllegalArgumentException("Selected guest was not found in the queue.");
        }

        QueueItem selectedItem = queue.get(selectedIndex);
        queue.removeAt(selectedIndex);

        LocalDateTime now = LocalDateTime.now();
        String normalizedIdentityNo = selectedItem.getIdentityNo() == null
            ? ""
            : selectedItem.getIdentityNo().trim();

        Customer customer = customerRepository.findByIdentityNo(normalizedIdentityNo);
        if (customer == null) {
            Customer newCustomer = new Customer();
            newCustomer.setIdentityNo(normalizedIdentityNo);
            newCustomer.setName(selectedItem.getName() == null ? "" : selectedItem.getName().trim());
            newCustomer.setLoyaltyTier(LoyaltyTier.BRONZE);
            newCustomer.setCreatedAt(now);
            newCustomer.setUpdatedAt(now);
            newCustomer.setIsActive(true);
            customer = customerRepository.save(newCustomer);
        } else {
            customer.setUpdatedAt(now);
            customerRepository.save(customer);
        }

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