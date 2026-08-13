package com.tarumt.tarumt_resorts.dao;

import com.tarumt.tarumt_resorts.entity.Redeem;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RedeemDAO extends JpaRepository<Redeem, Long> {
}
