package com.sports.sports_facility.repository;
import com.sports.sports_facility.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {}