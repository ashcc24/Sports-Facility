package com.sports.sports_facility.repository;
import com.sports.sports_facility.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudentStudentId(Long studentId);
}