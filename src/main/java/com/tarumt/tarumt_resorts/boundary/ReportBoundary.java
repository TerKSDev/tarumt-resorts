package com.tarumt.tarumt_resorts.boundary;

import java.time.LocalDateTime;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tarumt.tarumt_resorts.control.ReportControl;


@RestController
@RequestMapping("api/report")
@CrossOrigin(origins = "http://localhost:5173")
public class ReportBoundary {

    // Dependency Injection
    private final ReportControl reportControl;

    public ReportBoundary(ReportControl reportControl) {
        this.reportControl = reportControl;
    }

    // Ter Kean Sen: Today's Arrival & Departure List
    @GetMapping("/arrival-departure")
    public ResponseEntity<?> getArrivalDepartureReport() {
        return ResponseEntity.ok(reportControl.generateArrivalDepartureReport());
    }

    // Ter Kean Sen: In-House Guest Directory
    @GetMapping("/guest-directory")
    public ResponseEntity<?> getGuestDirectoryReport() {
        return ResponseEntity.ok(reportControl.generateGuestDirectoryReport());
    }

    // Lew Chun Hoe: Daily Walk-In Registration Summary
    @GetMapping("/walkin-summary")
    public ResponseEntity<?> getWalkInSummary(){
        return ResponseEntity.ok(reportControl.generateWalkInSummaryReport());
    }

    // Lew Chun Hoe: Registration Cancellation Analysis
    @GetMapping("/registration-cancellation")
    public ResponseEntity<?> getRegistrationCancellation(){
        return ResponseEntity.ok(reportControl.generateRegistrationCancellationReport());
    }

    // See Wei Jian: Staff Cleaning Turnaround
    @GetMapping("/cleaning-turnaround")
    public ResponseEntity<?> getCleaningTurnaround(
            @RequestParam(defaultValue = "") String filterStaffId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime rangeStart,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime rangeEnd) {
        return ResponseEntity.ok(reportControl.generateCleaningTurnaroundReport(filterStaffId, rangeStart, rangeEnd));
    }

    // See Wei Jian: Room Housekeeping Status
    @GetMapping("/housekeeping-status")
    public ResponseEntity<?> getHousekeepingStatus(
            @RequestParam(defaultValue = "") String filterStatus,
            @RequestParam(required = false) Long minMinutesWaiting) {
        return ResponseEntity.ok(reportControl.generateHousekeepingStatusReport(filterStatus, minMinutesWaiting));
    }

    // Tek Shao Xian: Member Points
    @GetMapping("/member-points")
    public String getMemberPoints(){
        return new String();
    }

    // Tek Shao Xian: Redemption Record
    @GetMapping("/redemption-record")
    public String getRedemptionRecord(){
        return new String();
    }
}
