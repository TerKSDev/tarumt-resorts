package com.tarumt.tarumt_resorts.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tarumt.tarumt_resorts.entity.Booking;
import com.tarumt.tarumt_resorts.entity.enums.BookingStatus;

@Repository
public interface BookingDAO extends JpaRepository<Booking, Long> {
    Booking findByConfirmationNo(String confirmationNo);

    @org.springframework.data.jpa.repository.Query("SELECT b FROM Booking b WHERE b.room.roomId = :roomId AND (b.status = :status1 OR b.status = :status2)")
    Booking findActiveOrCheckedInBooking(
        @org.springframework.data.repository.query.Param("roomId") String roomId, 
        @org.springframework.data.repository.query.Param("status1") BookingStatus status1, 
        @org.springframework.data.repository.query.Param("status2") BookingStatus status2
    );

    @org.springframework.data.jpa.repository.Query("SELECT b FROM Booking b JOIN FETCH b.customer JOIN FETCH b.room WHERE b.status = :status1 OR b.status = :status2")
    Booking[] findActiveAndCheckedInBookings(
        @org.springframework.data.repository.query.Param("status1") BookingStatus status1, 
        @org.springframework.data.repository.query.Param("status2") BookingStatus status2
    );
}
