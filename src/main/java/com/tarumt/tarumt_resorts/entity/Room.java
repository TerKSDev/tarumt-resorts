package com.tarumt.tarumt_resorts.entity;

import com.tarumt.tarumt_resorts.entity.enums.RoomType;
import com.tarumt.tarumt_resorts.entity.enums.RoomStatus;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "rooms")
public class Room {

    // Define Entity Attributes
    @Id
    @Column(name = "room_id")
    private String roomId;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private RoomType type = RoomType.STANDARD;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private RoomStatus status = RoomStatus.AVAILABLE;
    
    @Column(name = "capacity", nullable = false)
    private int capacity = 1;

    @Column(name = "price_per_night", nullable = false)
    private BigDecimal pricePerNight;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructor
    public Room() {}

    public Room(String roomId, RoomType type, RoomStatus status, int capacity, BigDecimal pricePerNight, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.roomId = roomId;   
        this.type = type;   
        this.status = status;   
        this.capacity = capacity;   
        this.pricePerNight = pricePerNight;   
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters
    public String getRoomId() {
        return this.roomId;    
    }

    public RoomType getType() {
        return this.type;    
    }

    public RoomStatus getStatus() {
        return this.status;    
    }

    public int getCapacity() {    
        return this.capacity;    
    }

    public BigDecimal getPricePerNight() {    
        return this.pricePerNight;    
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;    
    }

    public LocalDateTime getUpdatedAt() {
        return this.updatedAt;    
    }

    // Setters

    public void setRoomId(String roomId) {
        this.roomId = roomId;   
    }

    public void setType(RoomType type) {
        this.type = type;   
    }

    public void setStatus(RoomStatus status) {
        this.status = status;   
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;   
    }

    public void setPricePerNight(BigDecimal pricePerNight) {
        this.pricePerNight = pricePerNight;   
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
