package com.sports.sports_facility.repository;
import com.sports.sports_facility.model.CourtBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourtBookingRepository extends JpaRepository<CourtBooking, Long> {
    List<CourtBooking> findByStudentStudentId(Long studentId);
}