package com.sports.sports_facility.repository;

import com.sports.sports_facility.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {

    @Query("SELECT c FROM Course c LEFT JOIN FETCH c.sport LEFT JOIN FETCH c.coach")
    List<Course> findAllWithDetails();
}