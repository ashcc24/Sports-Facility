package com.sports.sports_facility.model;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "COURT")
@Data @NoArgsConstructor @AllArgsConstructor
public class Court {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "COURT_ID")
    private Long courtId;
    @ManyToOne @JoinColumn(name = "SPORT_ID")
    private Sport sport;
    private String location;
    private String status;
}