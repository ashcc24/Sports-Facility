package com.sports.sports_facility.model;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "SPORT")
@Data @NoArgsConstructor @AllArgsConstructor
public class Sport {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SPORT_ID")
    private Long sportId;
    @Column(name = "SPORT_NAME")
    private String sportName;
}