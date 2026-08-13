//By Tek Shao Xian

package com.tarumt.tarumt_resorts.dao;

import com.tarumt.tarumt_resorts.entity.Point;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PointDAO extends JpaRepository<Point, String> {
}
