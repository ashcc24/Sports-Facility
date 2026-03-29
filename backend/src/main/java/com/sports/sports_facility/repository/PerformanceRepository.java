package com.sports.sports_facility.repository;

import com.sports.sports_facility.model.Performance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PerformanceRepository extends JpaRepository<Performance, Long> {
    List<Performance> findByStudentStudentId(Long studentId);
}