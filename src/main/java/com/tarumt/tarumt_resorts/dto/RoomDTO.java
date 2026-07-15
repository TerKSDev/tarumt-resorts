package com.tarumt.tarumt_resorts.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.tarumt.tarumt_resorts.entity.enums.RoomStatus;
import com.tarumt.tarumt_resorts.entity.enums.RoomType;

public class RoomDTO {
    private String roomId;
    private RoomType type;
    private RoomStatus status;
    private int capacity;
    private BigDecimal pricePerNight;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String customerName;
    
    private BookingDTO booking;

    public static class BookingDTO {
        private Long bookingId;
        private LocalDateTime checkOutDate;
        private String status;
        private String customerName;

        public BookingDTO() {}

        public BookingDTO(Long bookingId, LocalDateTime checkOutDate, String status, String customerName) {
            this.bookingId = bookingId;
            this.checkOutDate = checkOutDate;
            this.status = status;
            this.customerName = customerName;
        }

        public Long getBookingId() { return bookingId; }
        public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
        public LocalDateTime getCheckOutDate() { return checkOutDate; }
        public void setCheckOutDate(LocalDateTime checkOutDate) { this.checkOutDate = checkOutDate; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }
    }

    public RoomDTO() {}

    // Getters and Setters
    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }
    public RoomType getType() { return type; }
    public void setType(RoomType type) { this.type = type; }
    public RoomStatus getStatus() { return status; }
    public void setStatus(RoomStatus status) { this.status = status; }
    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }
    public BigDecimal getPricePerNight() { return pricePerNight; }
    public void setPricePerNight(BigDecimal pricePerNight) { this.pricePerNight = pricePerNight; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public BookingDTO getBooking() { return booking; }
    public void setBooking(BookingDTO booking) { this.booking = booking; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
}
