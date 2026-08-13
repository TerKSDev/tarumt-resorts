package com.tarumt.tarumt_resorts.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tarumt.tarumt_resorts.entity.Customer;


public interface CustomerDAO extends JpaRepository<Customer, String> {
    // Custom query to find existing customers to avoid duplicates during check-in
    Customer findByIdentityNo(String identityNo);
}
