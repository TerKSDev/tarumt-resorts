package com.tarumt.tarumt_resorts.entity;

import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "points")
public class Point {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private String id;

    @Column(name = "customer_id", nullable = false)
    private String customerId;

    @Column(name = "point", nullable = true)
    private Integer point;

    @CreationTimestamp
    @Column(name = "date", nullable = true, updatable = false)
    private LocalDateTime date;

    @Column(name = "expire_date")
    private LocalDateTime expireDate;

    @Column(name = "Description")
    private String description;

    public Point() {}

    public Point(String customerId, Integer point, String description, LocalDateTime date, LocalDateTime expireDate) {
        this.customerId = customerId;
        this.point = point;
        this.description = description;
        this.date = date;
        this.expireDate = expireDate;
    }

    public String getId() {
        return this.id;
    }

    public String getCustomerId() {
        return this.customerId;
    }

    public Integer getPoint() {
        return this.point;
    }

    public String getDescription() {
        return this.description;
    }

    public LocalDateTime getDate() {
        return this.date;
    }

    public LocalDateTime getExpireDate() {
        return this.expireDate;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public void setPoint(Integer point) {
        this.point = point;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public void setExpireDate(LocalDateTime expireDate) {
        this.expireDate = expireDate;
    }
}