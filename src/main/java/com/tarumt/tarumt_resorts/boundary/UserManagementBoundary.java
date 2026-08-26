// Ter Kean Sen
package com.tarumt.tarumt_resorts.boundary;

import com.tarumt.tarumt_resorts.control.UserManagementControl;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
