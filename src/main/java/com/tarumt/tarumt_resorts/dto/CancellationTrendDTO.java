package com.tarumt.tarumt_resorts.dto;

import java.math.BigDecimal;

// Plain data holder grouping cancellations by month (yyyy-MM) for trend analysis.
public class CancellationTrendDTO {

    private String period;
    private int cancellationCount;
    private BigDecimal lostRevenue;

    public CancellationTrendDTO(String period, BigDecimal lostRevenue) {
        this.period = period;
        this.cancellationCount = 1;
        this.lostRevenue = lostRevenue;
    }

    public void addCancellation(BigDecimal amount) {
        this.cancellationCount++;
        this.lostRevenue = this.lostRevenue.add(amount);
    }

    public String getPeriod() { return period; }
    public int getCancellationCount() { return cancellationCount; }
    public BigDecimal getLostRevenue() { return lostRevenue; }
}
