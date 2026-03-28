package com.sports.sports_facility.repository;
import com.sports.sports_facility.model.Sport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SportRepository extends JpaRepository<Sport, Long> {}