package com.tarumt.tarumt_resorts.dao;

import com.tarumt.tarumt_resorts.entity.HousekeepingTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HousekeepingTaskDAO extends JpaRepository<HousekeepingTask, Long> {

    // latest task first - used to determine a room's current housekeeping stage
    List<HousekeepingTask> findByRoom_RoomIdOrderByCreatedAtDesc(String roomId);

    // chronological order - used when walking through a room's full history
    // to detect cleaning cycles (DIRTY -> READY_FOR_CHECKIN) for reports
    List<HousekeepingTask> findByRoom_RoomIdOrderByCreatedAtAsc(String roomId);

    List<HousekeepingTask> findAllByOrderByCreatedAtAsc();
}