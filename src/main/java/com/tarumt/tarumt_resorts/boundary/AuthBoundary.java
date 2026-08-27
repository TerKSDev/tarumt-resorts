package com.tarumt.tarumt_resorts.boundary;

import com.tarumt.tarumt_resorts.control.AuthControl;
import com.tarumt.tarumt_resorts.dto.StaffOptionDTO;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthBoundary {

    private final AuthControl authControl;

    public AuthBoundary(AuthControl authControl) {
        this.authControl = authControl;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String email, @RequestParam String password) {
        StaffOptionDTO result = authControl.login(email, password);
        if (result == null) {
            return ResponseEntity.status(401).body("Invalid email or password.");
        }
        return ResponseEntity.ok(result);
    }
}