package com.tarumt.tarumt_resorts.dao;

import com.tarumt.tarumt_resorts.entity.HousekeepingTask;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HousekeepingTaskDAO extends JpaRepository<HousekeepingTask, Long> {

    // latest task first - used to determine a room's current housekeeping stage
    Iterable<HousekeepingTask> findByRoom_RoomIdOrderByCreatedAtDesc(String roomId);

    // chronological order - used when walking through a room's full history
    // to detect cleaning cycles (DIRTY -> READY_FOR_CHECKIN) for reports
    Iterable<HousekeepingTask> findByRoom_RoomIdOrderByCreatedAtAsc(String roomId);

    Iterable<HousekeepingTask> findAllByOrderByCreatedAtAsc();
}