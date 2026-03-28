package com.sports.sports_facility.repository;
import com.sports.sports_facility.model.Coach;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoachRepository extends JpaRepository<Coach, Long> {}