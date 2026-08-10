//By Tek Shao Xian

package com.tarumt.tarumt_resorts.control;

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
@CrossOrigin(origins = "*")
public class RedeemController {

    private final RedeemRepository redeemRepository;

    public RedeemController(RedeemRepository redeemRepository) {
        this.redeemRepository = redeemRepository;
    }

    // GET http://localhost:8081/api/redeem
    @GetMapping("/redeem")
    public Object[] getRedeemRequests() {
        var rows = redeemRepository.findAll();
        return rows.toArray();
    }

    // POST http://localhost:8081/api/redeem
    @PostMapping("/redeem")
    public Redeem createRedeemRequest(@RequestBody CreateRedeemRequest request) {
        Redeem r = new Redeem(request.getCustomerId(), request.getPoint(), request.getDescription());
        return redeemRepository.save(r);
    }

    // PUT http://localhost:8081/api/redeem/{id}
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

    public static class UpdateStatusRequest {
        private Boolean status;

        public Boolean getStatus() { return status; }
        public void setStatus(Boolean status) { this.status = status; }
    }
}
