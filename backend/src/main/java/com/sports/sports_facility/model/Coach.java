package com.sports.sports_facility.model;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "COACH")
@Data @NoArgsConstructor @AllArgsConstructor
public class Coach {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "COACH_ID")
    private Long coachId;
    private String name;
    @ManyToOne @JoinColumn(name = "SPORT_ID")
    private Sport sport;
    private String phone;
    private Integer experience;
}