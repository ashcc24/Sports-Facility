package com.sports.sports_facility.dto;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class PerformanceDTO {
    private Long performanceId;
    private Long studentId;
    private String studentName;
    private Long sportId;
    private String sportName;

    // Common
    private Integer matchesPlayed;
    private Integer wins;

    // Cricket only
    private Integer runsScored;
    private Integer wicketsTaken;
    private Integer catchesTaken;

    // Badminton only
    private Integer pointsScored;
    private Integer setsWon;

    // Basketball only
    private Integer pointsScoredBasketball;
    private Integer assists;
    private Integer rebounds;
}