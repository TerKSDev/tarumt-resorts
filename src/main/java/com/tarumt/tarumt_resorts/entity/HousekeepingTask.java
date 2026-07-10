package com.tarumt.tarumt_resorts.entity;

import com.tarumt.tarumt_resorts.entity.enums.HousekeepingStatus;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "housekeeping_tasks")
public class HousekeepingTask {
    
    // Define Entity Attributes
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    private Long taskId;

    @Enumerated(EnumType.STRING)
    @Column(name = "old_status")
    private HousekeepingStatus oldStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_status", nullable = false)
    private HousekeepingStatus currentStatus = HousekeepingStatus.DIRTY;

    @Column(name = "remarks")
    private String remarks;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(
        name = "staff_id",
        referencedColumnName = "staff_id"
    )
    private Staff staff;

    @ManyToOne
    @JoinColumn(
        name = "room_id",
        referencedColumnName = "room_id"
    )
    private Room room;

    public HousekeepingTask() {}

    public HousekeepingTask(
        Long taskId,
        HousekeepingStatus oldStatus,
        HousekeepingStatus currentStatus,
        String remarks,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Staff staff,
        Room room
    ) {
        this.taskId = taskId;   
        this.oldStatus = oldStatus;   
        this.currentStatus = currentStatus;   
        this.remarks = remarks;   
        this.createdAt = createdAt;   
        this.updatedAt = updatedAt;   
        this.staff = staff;   
        this.room = room;   
    }

    // Getters
    public Long getTaskId() {
        return this.taskId;    
    }

    public HousekeepingStatus getOldStatus() {
        return this.oldStatus;    
    }

    public HousekeepingStatus getCurrentStatus() {
        return this.currentStatus;    
    }

    public String getRemarks() {
        return this.remarks;    
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;    
    }

    public LocalDateTime getUpdatedAt() {
        return this.updatedAt;    
    }

    public Staff getStaff() {
        return this.staff;    
    }

    public Room getRoom() {
        return this.room;    
    }

    // Setters
    public void setTaskId(Long taskId) {
        this.taskId = taskId;   
    }

    public void setOldStatus(HousekeepingStatus oldStatus) {
        this.oldStatus = oldStatus;   
    }

    public void setCurrentStatus(HousekeepingStatus currentStatus) {
        this.currentStatus = currentStatus;   
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;   
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;   
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;   
    }

    public void setStaff(Staff staff) {
        this.staff = staff;   
    }

    public void setRoom(Room room) {
        this.room = room;   
    }
}
