package com.tarumt.tarumt_resorts.dto;

import java.math.BigDecimal;

import com.tarumt.tarumt_resorts.entity.enums.CancellationReason;

// Plain data holder grouping cancellations by reason for trend analysis.
public class CancellationReasonDTO {

    private CancellationReason reason;
    private int cancellationCount;
    private BigDecimal lostRevenue;

    public CancellationReasonDTO(CancellationReason reason, BigDecimal lostRevenue) {
        this.reason = reason;
        this.cancellationCount = 1;
        this.lostRevenue = lostRevenue;
    }

    public void addCancellation(BigDecimal amount) {
        this.cancellationCount++;
        this.lostRevenue = this.lostRevenue.add(amount);
    }

    public CancellationReason getReason() { return reason; }
    public int getCancellationCount() { return cancellationCount; }
    public BigDecimal getLostRevenue() { return lostRevenue; }
}
