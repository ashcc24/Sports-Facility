package com.sports.sports_facility.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity @Table(name = "COURT_BOOKING")
@Data @NoArgsConstructor @AllArgsConstructor
public class CourtBooking {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BOOKING_ID")
    private Long bookingId;
    @ManyToOne @JoinColumn(name = "STUDENT_ID")
    private Student student;
    @ManyToOne @JoinColumn(name = "COURT_ID")
    private Court court;
    @Column(name = "BOOKING_DATE")
    private LocalDate bookingDate;
    @Column(name = "START_TIME") private String startTime;
    @Column(name = "END_TIME") private String endTime;
}