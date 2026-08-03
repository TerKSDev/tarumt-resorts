package com.tarumt.tarumt_resorts;

import com.tarumt.tarumt_resorts.entity.Customer;
import com.tarumt.tarumt_resorts.entity.enums.LoyaltyTier;
import com.tarumt.tarumt_resorts.repository.CustomerRepository;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // same as HelloController — open for React dev
public class CustomerController {

    private final CustomerRepository customerRepository;

    public CustomerController(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    // GET http://localhost:8081/api/customers
    @GetMapping("/customers")
    public List<Customer> getCustomers() {
        return customerRepository.findAll();
    }

    // PUT http://localhost:8081/api/customers/{customerId}/tier
    // Body: { "loyaltyTier": "GOLD" }
    // Persists the new tier onto the customers.loyalty_tier column.
    @PutMapping("/customers/{customerId}/tier")
    public ResponseEntity<Customer> updateTier(@PathVariable String customerId, @RequestBody UpdateTierRequest request) {
        return customerRepository.findById(customerId)
                .map(customer -> {
                    customer.setLoyaltyTier(LoyaltyTier.valueOf(request.getLoyaltyTier().toUpperCase()));
                    Customer saved = customerRepository.save(customer);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Request body shape for PUT /api/customers/{customerId}/tier
    public static class UpdateTierRequest {
        private String loyaltyTier;

        public String getLoyaltyTier() { return loyaltyTier; }
        public void setLoyaltyTier(String loyaltyTier) { this.loyaltyTier = loyaltyTier; }
    }
}