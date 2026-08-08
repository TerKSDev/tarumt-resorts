package com.tarumt.tarumt_resorts.entity;

import com.tarumt.tarumt_resorts.entity.enums.LoyaltyTier;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "customers")
public class Customer {
    
    // Define Entity Attributes
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "customer_id")
    private String customerId;

    @Column(name = "identity_no", nullable = false, unique = true)
    private String identityNo;

    @Column(name = "name", nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "loyalty_tier", nullable = false)
    private LoyaltyTier loyaltyTier = LoyaltyTier.BRONZE;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    // Constructor
    public Customer() {}

    public Customer(String customerId, String identityNo, String name, LoyaltyTier loyaltyTier, LocalDateTime createdAt, LocalDateTime updatedAt, Boolean isActive) {
        this.customerId = customerId;   
        this.identityNo = identityNo;   
        this.name = name;   
        this.loyaltyTier = loyaltyTier;   
        this.createdAt = createdAt;   
        this.updatedAt = updatedAt;   
        this.isActive = isActive;   
    }

    // Getters
    public String getCustomerId() {
        return this.customerId;    
    }

    public String getIdentityNo() {
        return this.identityNo;    
    }

    public String getName() {
        return this.name;    
    }

    public LoyaltyTier getLoyaltyTier() {
        return this.loyaltyTier;    
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
    public void setCustomerId(String customerId) {
        this.customerId = customerId;   
    }

    public void setIdentityNo(String identityNo) {
        this.identityNo = identityNo;   
    }

    public void setName(String name) {
        this.name = name;   
    }

    public void setLoyaltyTier(LoyaltyTier loyaltyTier) {
        this.loyaltyTier = loyaltyTier;   
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
