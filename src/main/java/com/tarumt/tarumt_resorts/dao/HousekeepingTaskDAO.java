/**
 * Author: See Wei Jian
 */
package com.tarumt.tarumt_resorts.dao;

import com.tarumt.tarumt_resorts.entity.HousekeepingTask;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HousekeepingTaskDAO extends JpaRepository<HousekeepingTask, Long> {
    Iterable<HousekeepingTask> findByRoom_RoomId(String roomId);
}