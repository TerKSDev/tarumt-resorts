package com.tarumt.tarumt_resorts.control;

import com.tarumt.tarumt_resorts.dao.StaffDAO;
import com.tarumt.tarumt_resorts.dto.StaffOptionDTO;
import com.tarumt.tarumt_resorts.entity.Staff;

import org.springframework.stereotype.Service;

@Service
public class AuthControl {

    private final StaffDAO staffDAO;

    public AuthControl(StaffDAO staffDAO) {
        this.staffDAO = staffDAO;
    }

    /**
     * Returns the logged-in staff's safe info if email/password match an
     * active staff account, or null if login fails.
     *
     * NOTE: this compares plaintext passwords, matching how Staff.password
     * is currently stored in the DB. This is fine for coursework scope,
     * but a real system should hash passwords (e.g. BCrypt) instead of
     * storing/comparing them in plaintext - worth mentioning as a
     * follow-up if security is discussed in the report.
     */
    public StaffOptionDTO login(String email, String password) {
        Staff staff = staffDAO.findByEmail(email);
        if (staff == null) return null;
        if (staff.getIsActive() == null || !staff.getIsActive()) return null;
        if (!staff.getPassword().equals(password)) return null;

        return new StaffOptionDTO(staff.getStaffId(), staff.getName());
    }
}