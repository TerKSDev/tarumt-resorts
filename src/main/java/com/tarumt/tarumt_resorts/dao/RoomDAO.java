package com.tarumt.tarumt_resorts.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tarumt.tarumt_resorts.entity.Room;

@Repository
public interface RoomDAO extends JpaRepository<Room, String> {
    Room[] findAllBy();
}
