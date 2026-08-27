package com.tarumt.tarumt_resorts.dao;

import com.tarumt.tarumt_resorts.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffDAO extends JpaRepository<Staff, String> {
    Staff findByEmail(String email);
}