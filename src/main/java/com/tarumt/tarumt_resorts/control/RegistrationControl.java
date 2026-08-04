package com.tarumt.tarumt_resorts.control;

import com.tarumt.tarumt_resorts.dao.BookingDAO;
import com.tarumt.tarumt_resorts.dao.CustomerDAO;
import com.tarumt.tarumt_resorts.entity.Booking;
import com.tarumt.tarumt_resorts.entity.Customer;
import com.tarumt.tarumt_resorts.entity.enums.BookingStatus;
import com.tarumt.tarumt_resorts.entity.enums.LoyaltyTier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class RegistrationControl {

    private final CustomerDAO customerRepository;
    private final BookingDAO bookingRepository;

    // Linear Queue ADT stored in memory (FIFO)
    private final Queue<QueueItem> queue = new LinkedList<>();

    public RegistrationControl(CustomerDAO customerRepository, BookingDAO bookingRepository) {
        this.customerRepository = customerRepository;
        this.bookingRepository = bookingRepository;
    }

    // Inner Class representing temporary queue memory item
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

        boolean duplicateInQueue = queue.stream()
            .anyMatch(existing -> normalizedIdentityNo.equalsIgnoreCase(existing.getIdentityNo()));

        if (duplicateInQueue) {
            throw new IllegalArgumentException("This identity number is already in the queue.");
        }

        Customer existingCustomer = customerRepository.findByIdentityNo(normalizedIdentityNo);
        if (existingCustomer != null) {
            throw new IllegalArgumentException("This identity number already exists in the system.");
        }

        item.setId(UUID.randomUUID().toString());
        item.setIdentityNo(normalizedIdentityNo);
        item.setName(item.getName() == null ? "" : item.getName().trim());
        item.setCheckIn(LocalDateTime.now());
        queue.add(item);
        return item;
    }

    // View current queue snapshot
    public List<QueueItem> getQueue() {
        return new ArrayList<>(queue);
    }

    // Dequeue selected guest by row ID and persist Customer and Booking entities to DB
    @Transactional
    public Booking processGuestById(String queueId) {
        if (queueId == null || queueId.isBlank()) {
            throw new IllegalArgumentException("Queue item id is required.");
        }

        QueueItem selectedItem = queue.stream()
            .filter(item -> queueId.equals(item.getId()))
            .findFirst()
            .orElse(null);

        if (selectedItem == null) {
            throw new NoSuchElementException("Selected guest was not found in the queue.");
        }

        queue.remove(selectedItem);

        LocalDateTime now = LocalDateTime.now();
        String normalizedIdentityNo = selectedItem.getIdentityNo() == null
            ? ""
            : selectedItem.getIdentityNo().trim();

        // Look up existing Customer entity OR create new one
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

        // Create and persist Booking entity
        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setConfirmationNo(generateConfirmationNumber());
        booking.setCheckInDate(now);
        booking.setCheckOutDate(null);
        booking.setTotalAmount(BigDecimal.valueOf(150.00));
        booking.setIsPaid(true);
        booking.setStatus(BookingStatus.ACTIVE);
        booking.setCreatedAt(now);
        booking.setUpdatedAt(now);

        return bookingRepository.save(booking);
    }

    private String generateConfirmationNumber() {
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}