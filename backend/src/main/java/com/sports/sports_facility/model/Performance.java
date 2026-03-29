package com.sports.sports_facility.model;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "PERFORMANCE")
@Data @NoArgsConstructor @AllArgsConstructor
public class Performance {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PERFORMANCE_ID")
    private Long performanceId;

    @ManyToOne @JoinColumn(name = "STUDENT_ID")
    private Student student;

    @ManyToOne @JoinColumn(name = "SPORT_ID")
    private Sport sport;

    // ── Common to ALL sports ─────────────────────────────
    @Column(name = "MATCHES_PLAYED")
    private Integer matchesPlayed;

    @Column(name = "WINS")
    private Integer wins;

    // ── Cricket only ─────────────────────────────────────
    @Column(name = "RUNS_SCORED")
    private Integer runsScored;

    @Column(name = "WICKETS_TAKEN")
    private Integer wicketsTaken;

    @Column(name = "CATCHES_TAKEN")
    private Integer catchesTaken;

    // ── Badminton only ───────────────────────────────────
    @Column(name = "POINTS_SCORED")
    private Integer pointsScored;

    @Column(name = "SETS_WON")
    private Integer setsWon;

    // ── Basketball only ──────────────────────────────────
    @Column(name = "POINTS_SCORED_BASKETBALL")
    private Integer pointsScoredBasketball;

    @Column(name = "ASSISTS")
    private Integer assists;

    @Column(name = "REBOUNDS")
    private Integer rebounds;
}