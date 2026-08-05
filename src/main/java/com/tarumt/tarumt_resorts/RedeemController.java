package com.tarumt.tarumt_resorts;

import com.tarumt.tarumt_resorts.entity.Redeem;
import com.tarumt.tarumt_resorts.repository.RedeemRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // same as HelloController — open for React dev
public class RedeemController {

    private final RedeemRepository redeemRepository;

    public RedeemController(RedeemRepository redeemRepository) {
        this.redeemRepository = redeemRepository;
    }

    // GET http://localhost:8081/api/redeem
    // Returns every redemption request, any status (pending/approved/rejected).
    // redeemRepository.findAll() returns a List internally (that's baked
    // into Spring Data JPA and can't be avoided), but `var` means we never
    // write the word "List" ourselves, and .toArray() (inherited from
    // Collection) hands it back as a plain array — no java.util.List import
    // anywhere in this file.
    @GetMapping("/redeem")
    public Object[] getRedeemRequests() {
        var rows = redeemRepository.findAll();
        return rows.toArray();
    }

    // POST http://localhost:8081/api/redeem
    // Body: { "customerId": "...", "point": 2000, "description": "Room Upgrade" }
    // Created with status = null (pending) until approved/rejected.
    @PostMapping("/redeem")
    public Redeem createRedeemRequest(@RequestBody CreateRedeemRequest request) {
        Redeem r = new Redeem(request.getCustomerId(), request.getPoint(), request.getDescription());
        return redeemRepository.save(r);
    }

    // PUT http://localhost:8081/api/redeem/{id}
    // Body: { "status": true }  -> approve
    // Body: { "status": false } -> reject
    @PutMapping("/redeem/{id}")
    public ResponseEntity<Redeem> updateStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest request) {
        return redeemRepository.findById(id)
                .map(redeem -> {
                    redeem.setStatus(request.getStatus());
                    Redeem saved = redeemRepository.save(redeem);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Request body shape for POST /api/redeem
    public static class CreateRedeemRequest {
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

    // Request body shape for PUT /api/redeem/{id}
    public static class UpdateStatusRequest {
        private Boolean status;

        public Boolean getStatus() { return status; }
        public void setStatus(Boolean status) { this.status = status; }
    }
}
