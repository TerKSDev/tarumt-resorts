// Ter Kean Sen
package com.tarumt.tarumt_resorts.boundary;

import com.tarumt.tarumt_resorts.control.UserManagementControl;
import com.tarumt.tarumt_resorts.entity.Staff;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/user-management")
@CrossOrigin(origins = "http://localhost:5173")
public class UserManagementBoundary {
    
    // Dependency Injection
    private final UserManagementControl userManagementControl;
    
    public UserManagementBoundary(UserManagementControl userManagementControl) {
        this.userManagementControl = userManagementControl;
    }

    // Execute Frontend Request

    @GetMapping
    public ResponseEntity<List<Staff>> getAllStaff() {
        return ResponseEntity.ok(userManagementControl.getAllStaff());
    }

    @PostMapping
    public ResponseEntity<?> addStaff(@RequestBody Staff staff) {
        try {
            Staff newStaff = userManagementControl.addStaff(staff);
            return ResponseEntity.ok(newStaff);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{staffId}/toggle")
    public ResponseEntity<?> toggleStaffStatus(@PathVariable String staffId) {
        try {
            Staff updatedStaff = userManagementControl.toggleStaffStatus(staffId);
            return ResponseEntity.ok(updatedStaff);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
