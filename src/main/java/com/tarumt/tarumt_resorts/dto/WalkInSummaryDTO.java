package com.tarumt.tarumt_resorts.dto;

import java.math.BigDecimal;

import com.tarumt.tarumt_resorts.entity.Booking;

// Plain data holder for the "Daily Walk-In Registration Summary" report. Not a JPA entity.
public class WalkInSummaryDTO {

    private String date;
    private int totalWalkIns;
    private BigDecimal totalRevenue;
    private Booking[] walkIns;

    public WalkInSummaryDTO(String date, int totalWalkIns, BigDecimal totalRevenue, Booking[] walkIns) {
        this.date = date;
        this.totalWalkIns = totalWalkIns;
        this.totalRevenue = totalRevenue;
        this.walkIns = walkIns;
    }

    public String getDate() { return date; }
    public int getTotalWalkIns() { return totalWalkIns; }
    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public Booking[] getWalkIns() { return walkIns; }
}
