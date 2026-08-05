package com.tarumt.tarumt_resorts.repository;

import com.tarumt.tarumt_resorts.entity.Point;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// No custom finder methods here — the only ones this app needs (getAllPoints,
// filtering by customer) are done in PointService using the MyList ADT
// instead, so this interface never has to name java.util.List itself.
@Repository
public interface PointRepository extends JpaRepository<Point, String> {
}
