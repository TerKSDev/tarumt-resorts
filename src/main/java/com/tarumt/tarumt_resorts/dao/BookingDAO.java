package com.tarumt.tarumt_resorts.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tarumt.tarumt_resorts.entity.Booking;

@Repository
public interface BookingDAO extends JpaRepository<Booking, Long> {
    Booking findByConfirmationNo(String confirmationNo);
}
