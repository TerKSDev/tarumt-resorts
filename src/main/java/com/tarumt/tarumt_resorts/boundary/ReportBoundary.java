package com.tarumt.tarumt_resorts.boundary;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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
    public String getWalkInSummary(){
        return new String();
    }

    // Lew Chun Hoe: Registration Cancellation Analysis
    @GetMapping("/registration-cancellation")
    public String getRegistrationCancellation(){
        return new String();
    }

    // See Wei Jian: Staff Cleaning Turnaround
    @GetMapping("/cleaning-turnaround")
    public String getCleaningTurnaround(){
        return new String();
    }

    // See Wei Jian: Room Housekeeping Status
    @GetMapping("/housekeeping-status")
    public String getHousekeepingStatus(){
        return new String();
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
