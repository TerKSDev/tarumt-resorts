package com.tarumt.tarumt_resorts.repository;

import com.tarumt.tarumt_resorts.entity.Redeem;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RedeemRepository extends JpaRepository<Redeem, Long> {
    List<Redeem> findByCustomerId(String customerId);
}
