package com.tarumt.tarumt_resorts.dao;
import com.tarumt.tarumt_resorts.entity.HousekeepingTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HousekeepingTaskDAO extends JpaRepository<HousekeepingTask, Long> {
}