package com.tarumt.tarumt_resorts.entity;

import com.tarumt.tarumt_resorts.entity.enums.BookingStatus;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "bookings")
public class Booking {

    // Define Entity Attributes
    @Id
    @Column(name = "booking_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    @Column(name = "confirmation_no", unique = true, nullable = false, length = 8)
    private String confirmationNo;

    @Column(name = "check_in_date")
    private LocalDateTime checkInDate;

    @Column(name = "check_out_date")
    private LocalDateTime checkOutDate;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "is_paid")
    private Boolean isPaid = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private BookingStatus status;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "room_id", referencedColumnName = "room_id")
    private Room room;

    // Constructor
    public Booking() {}

    public Booking(Long bookingId, String confirmationNo, LocalDateTime checkInDate, LocalDateTime checkOutDate, BigDecimal totalAmount, Boolean isPaid, BookingStatus status, LocalDateTime createdAt, LocalDateTime updatedAt, Customer customer, Room room) {
        this.bookingId = bookingId;
        this.confirmationNo = confirmationNo;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.totalAmount = totalAmount;
        this.isPaid = isPaid;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.customer = customer;
        this.room = room;
    }

    // Getters
    public Long getBookingId() {
        return this.bookingId;
    }

    public String getConfirmationNo() {
        return this.confirmationNo;
    }

    public LocalDateTime getCheckInDate() {
        return this.checkInDate;
    }

    public LocalDateTime getCheckOutDate() {
        return this.checkOutDate;
    }

    public BigDecimal getTotalAmount() {
        return this.totalAmount;
    }

    public Boolean getIsPaid() {
        return this.isPaid;
    }

    public BookingStatus getStatus() {
        return this.status;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return this.updatedAt;
    }

    public Customer getCustomer() {
        return this.customer;
    }

    public Room getRoom() {
        return this.room;
    }

    // Setters
    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public void setConfirmationNo(String confirmationNo) {
        this.confirmationNo = confirmationNo;
    }

    public void setCheckInDate(LocalDateTime checkInDate) {
        this.checkInDate = checkInDate;
    }

    public void setCheckOutDate(LocalDateTime checkOutDate) {
        this.checkOutDate = checkOutDate;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public void setIsPaid(Boolean isPaid) {
        this.isPaid = isPaid;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public void setRoom(Room room) {
        this.room = room;
    }
}
