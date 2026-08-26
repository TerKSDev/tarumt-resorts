package com.tarumt.tarumt_resorts.control;

import org.springframework.stereotype.Service;

import com.tarumt.tarumt_resorts.dao.StaffDAO;
import com.tarumt.tarumt_resorts.entity.Staff;
import com.tarumt.tarumt_resorts.adt.MyList;
import com.tarumt.tarumt_resorts.adt.MyArrayList;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Service
public class UserManagementControl {

    private final StaffDAO staffDao;

    public UserManagementControl(StaffDAO staffDao) {
        this.staffDao = staffDao;
    }

    // Get all staff members using custom ADT
    public MyList<Staff> getAllStaff() {
        Iterable<Staff> staffIterable = staffDao.findAll();
        MyList<Staff> myStaffList = new MyArrayList<>();
        for (Staff staff : staffIterable) {
            myStaffList.add(staff);
        }
        return myStaffList;
    }

    // Add a new staff member with SHA-256 hashed password
    public Staff addStaff(Staff staff) {
        if (staff == null || staff.getEmail() == null || staff.getPassword() == null) {
            throw new IllegalArgumentException("Staff details cannot be null");
        }

        // Simple SHA-256 hashing to avoid storing plain-text passwords
        staff.setPassword(hashPassword(staff.getPassword()));
        
        return staffDao.save(staff);
    }

    // Toggle staff active status (soft delete)
    public Staff toggleStaffStatus(String staffId) {
        Staff staff = staffDao.findById(staffId)
            .orElseThrow(() -> new IllegalArgumentException("Staff not found"));
        
        staff.setIsActive(!staff.getIsActive());
        return staffDao.save(staff);
    }

    // Helper method to hash password
    private String hashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(password.getBytes());
            StringBuilder hexString = new StringBuilder();
            
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }
}
