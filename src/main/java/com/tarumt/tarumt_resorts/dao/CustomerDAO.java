package com.tarumt.tarumt_resorts.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tarumt.tarumt_resorts.entity.Customer;


public interface CustomerDAO extends JpaRepository<Customer, String> {
    
}
