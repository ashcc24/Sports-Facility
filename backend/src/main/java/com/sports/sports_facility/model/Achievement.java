package com.sports.sports_facility.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity @Table(name = "ACHIEVEMENT")
@Data @NoArgsConstructor @AllArgsConstructor
public class Achievement {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ACHIEVEMENT_ID")
    private Long achievementId;
    @ManyToOne @JoinColumn(name = "STUDENT_ID")
    private Student student;
    @ManyToOne @JoinColumn(name = "SPORT_ID")
    private Sport sport;
    private String title;
    @Column(name = "DATE_WON")
    private LocalDate dateWon;
}