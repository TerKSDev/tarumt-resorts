package com.tarumt.tarumt_resorts.repository;

import com.tarumt.tarumt_resorts.entity.Point;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PointRepository extends JpaRepository<Point, String> {
    List<Point> findByCustomerId(String customerId);
}