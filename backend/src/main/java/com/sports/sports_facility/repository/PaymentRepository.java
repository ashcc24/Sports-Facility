package com.sports.sports_facility.repository;
import com.sports.sports_facility.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByStudentStudentId(Long studentId);
}