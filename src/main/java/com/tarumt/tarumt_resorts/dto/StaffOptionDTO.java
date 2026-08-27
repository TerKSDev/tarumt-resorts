package com.tarumt.tarumt_resorts.dto;

/**
 * Minimal, safe-to-expose staff info returned after login.
 * Deliberately excludes password and other sensitive fields.
 * Not a JPA entity - not persisted.
 */
public class StaffOptionDTO {

    private String staffId;
    private String name;

    public StaffOptionDTO(String staffId, String name) {
        this.staffId = staffId;
        this.name = name;
    }

    public String getStaffId() { return staffId; }
    public String getName() { return name; }
}