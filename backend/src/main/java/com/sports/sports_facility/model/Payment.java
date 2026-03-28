package com.sports.sports_facility.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity @Table(name = "PAYMENT")
@Data @NoArgsConstructor @AllArgsConstructor
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PAYMENT_ID")
    private Long paymentId;
    @ManyToOne @JoinColumn(name = "STUDENT_ID")
    private Student student;
    @ManyToOne @JoinColumn(name = "COURSE_ID")
    private Course course;
    private Double amount;
    @Column(name = "PAYMENT_DATE")
    private LocalDate paymentDate;
    private String status;
}