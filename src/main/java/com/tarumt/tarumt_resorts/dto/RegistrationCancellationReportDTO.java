package com.tarumt.tarumt_resorts.dto;

import java.math.BigDecimal;

import com.tarumt.tarumt_resorts.entity.Booking;

// Plain data holder for the "Registration Cancellation Analysis" report. Not a JPA entity.
public class RegistrationCancellationReportDTO {

    private int totalCancellations;
    private BigDecimal totalLostRevenue;
    private double cancellationRate;
    private CancellationTrendDTO[] trends;
    private CancellationReasonDTO[] reasonBreakdown;
    private Booking[] cancelledBookings;

    public RegistrationCancellationReportDTO(int totalCancellations, BigDecimal totalLostRevenue,
            double cancellationRate, CancellationTrendDTO[] trends, CancellationReasonDTO[] reasonBreakdown,
            Booking[] cancelledBookings) {
        this.totalCancellations = totalCancellations;
        this.totalLostRevenue = totalLostRevenue;
        this.cancellationRate = cancellationRate;
        this.trends = trends;
        this.reasonBreakdown = reasonBreakdown;
        this.cancelledBookings = cancelledBookings;
    }

    public int getTotalCancellations() { return totalCancellations; }
    public BigDecimal getTotalLostRevenue() { return totalLostRevenue; }
    public double getCancellationRate() { return cancellationRate; }
    public CancellationTrendDTO[] getTrends() { return trends; }
    public CancellationReasonDTO[] getReasonBreakdown() { return reasonBreakdown; }
    public Booking[] getCancelledBookings() { return cancelledBookings; }
}
