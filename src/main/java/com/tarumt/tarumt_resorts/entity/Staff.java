package com.tarumt.tarumt_resorts.entity;

import com.tarumt.tarumt_resorts.entity.enums.StaffRole;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "staffs")
public class Staff {
    
    // Define Entity Attributes
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "staff_id")
    private String staffId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private StaffRole role = StaffRole.HOUSEKEEPING;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    // Constructor
    public Staff() {}

    public Staff(String staffId, String name, String email, String password, StaffRole role, LocalDateTime createdAt, LocalDateTime updatedAt, Boolean isActive) {
        this.staffId = staffId;   
        this.name = name;   
        this.email = email;   
        this.password = password;
        this.role = role;   
        this.createdAt = createdAt;   
        this.updatedAt = updatedAt;   
        this.isActive = isActive;
    }

    // Getters
    public String getStaffId() {
        return this.staffId;    
    }

    public String getName() {
        return this.name;    
    }

    public String getEmail() {
        return this.email;    
    }

    public String getPassword() {
        return this.password;
    }

    public StaffRole getRole() {
        return this.role;    
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;    
    }

    public LocalDateTime getUpdatedAt() {
        return this.updatedAt;    
    }

    public Boolean getIsActive() {
        return this.isActive;    
    }

    // Setters
    public void setStaffId(String staffId) {
        this.staffId = staffId;   
    }

    public void setName(String name) {
        this.name = name;   
    }

    public void setEmail(String email) {
        this.email = email;   
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(StaffRole role) {
        this.role = role;   
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;   
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;   
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;   
    }
}
