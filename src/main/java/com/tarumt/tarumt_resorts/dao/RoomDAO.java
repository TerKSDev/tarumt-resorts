package com.tarumt.tarumt_resorts.dao;

import org.springframework.data.jpa.repository.JpaRepository;


import com.tarumt.tarumt_resorts.entity.Room;


public interface RoomDAO extends JpaRepository<Room, String> {
    Room[] findAllBy();
}
