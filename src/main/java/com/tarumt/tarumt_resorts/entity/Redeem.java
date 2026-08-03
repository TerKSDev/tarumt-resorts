package com.tarumt.tarumt_resorts.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "Redeem")
public class Redeem {

    // id is an auto-increment INTEGER PRIMARY KEY in the real table.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "customer_id")
    private String customerId;

    @Column(name = "point")
    private Integer point;

    // null = pending, true = approved, false = rejected
    @Column(name = "status")
    private Boolean status;

    // the redeemed reward's name
    @Column(name = "description")
    private String description;

    // when the request was submitted
    @Column(name = "date")
    private Instant date;

    public Redeem() {}

    public Redeem(String customerId, Integer point, String description) {
        this.customerId = customerId;
        this.point = point;
        this.description = description;
        this.status = null; // pending until approved/rejected
        this.date = Instant.now();
    }

    public Long getId() {
        return this.id;
    }

    public String getCustomerId() {
        return this.customerId;
    }

    public Integer getPoint() {
        return this.point;
    }

    public Boolean getStatus() {
        return this.status;
    }

    public String getDescription() {
        return this.description;
    }

    public Instant getDate() {
        return this.date;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public void setPoint(Integer point) {
        this.point = point;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDate(Instant date) {
        this.date = date;
    }
}