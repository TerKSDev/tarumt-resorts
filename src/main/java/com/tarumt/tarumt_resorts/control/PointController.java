//By Tek Shao Xian

package com.tarumt.tarumt_resorts.control;

import com.tarumt.tarumt_resorts.entity.Point;
import com.tarumt.tarumt_resorts.service.PointService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // same as HelloController — open for React dev
public class PointController {

    private final PointService pointService;

    public PointController(PointService pointService) {
        this.pointService = pointService;
    }

    // GET http://localhost:8081/api/points
    // Returns every point row for every customer. Built entirely with the
    // MyList ADT in PointService — Object[] (not List<Point>) is used only
    // right here, at the very edge, so Spring/Jackson can turn it into a
    // JSON array. No java.util.List anywhere in this file.
    @GetMapping("/points")
    public Object[] getPoints() {
        return pointService.getAllPoints().toArray();
    }

    // GET http://localhost:8081/api/points/{customerId}/balance
    // Returns { "customerId": ..., "activeBalance": ..., "lifetimeBalance": ... }
    // computed entirely via the MyList ADT in PointService.
    @GetMapping("/points/{customerId}/balance")
    public BalanceResponse getBalance(@PathVariable String customerId) {
        int active = pointService.getActiveBalance(customerId);
        int lifetime = pointService.getLifetimeBalance(customerId);
        return new BalanceResponse(customerId, active, lifetime);
    }

    // POST http://localhost:8081/api/points
    // Body: { "customerId": "...", "point": 500, "description": "Stay: 2 nights" }
    @PostMapping("/points")
    public Point awardPoint(@RequestBody AwardPointRequest request) {
        return pointService.awardPoints(request.getCustomerId(), request.getPoint(), request.getDescription());
    }

    // Request body shape for POST /api/points
    public static class AwardPointRequest {
        private String customerId;
        private Integer point;
        private String description;

        public String getCustomerId() { return customerId; }
        public void setCustomerId(String customerId) { this.customerId = customerId; }
        public Integer getPoint() { return point; }
        public void setPoint(Integer point) { this.point = point; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    // Response body shape for GET /api/points/{customerId}/balance
    public static class BalanceResponse {
        private String customerId;
        private int activeBalance;
        private int lifetimeBalance;

        public BalanceResponse(String customerId, int activeBalance, int lifetimeBalance) {
            this.customerId = customerId;
            this.activeBalance = activeBalance;
            this.lifetimeBalance = lifetimeBalance;
        }

        public String getCustomerId() { return customerId; }
        public int getActiveBalance() { return activeBalance; }
        public int getLifetimeBalance() { return lifetimeBalance; }
    }
}
