package com.tarumt.tarumt_resorts.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tarumt.tarumt_resorts.entity.Booking;
import com.tarumt.tarumt_resorts.entity.enums.BookingStatus;

public interface BookingDAO extends JpaRepository<Booking, Long> {
    // Derived Query Method
    // Ter Kean Sen: Get bookings details by confirmation number
    Booking findByConfirmationNo(String confirmationNo);

    // Ter Kean Sen: Get in-house guest directory
    Booking[] findByStatus(BookingStatus status);

    // Ter Kean Sen: Get today's arrivals and departures
    @org.springframework.data.jpa.repository.Query(value = "SELECT * FROM bookings WHERE date(check_in_date) = :today OR date(check_out_date) = :today", nativeQuery = true)
    Booking[] findTodayArrivalAndDeparture(@org.springframework.data.repository.query.Param("today") String today);


    // Custom Query Method (Java Persistence Query Language: JPQL)
    // Ter Kean Sen: Get bookings that are active or checked in
    @org.springframework.data.jpa.repository.Query("SELECT b FROM Booking b WHERE b.room.roomId = :roomId AND (b.status = :status1 OR b.status = :status2)")
    Booking findActiveOrCheckedInBooking(
        @org.springframework.data.repository.query.Param("roomId") String roomId, 
        @org.springframework.data.repository.query.Param("status1") BookingStatus status1, 
        @org.springframework.data.repository.query.Param("status2") BookingStatus status2
    );

    // Ter Kean Sen: Get active or checked in bookings with join fetch
    @org.springframework.data.jpa.repository.Query("SELECT b FROM Booking b JOIN FETCH b.customer JOIN FETCH b.room WHERE b.status = :status1 OR b.status = :status2")
    Booking[] findActiveAndCheckedInBookings(
        @org.springframework.data.repository.query.Param("status1") BookingStatus status1, 
        @org.springframework.data.repository.query.Param("status2") BookingStatus status2
    );

}
