package com.tarumt.tarumt_resorts.repository;

import com.tarumt.tarumt_resorts.entity.Customer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {
}
