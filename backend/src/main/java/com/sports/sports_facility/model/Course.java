package com.sports.sports_facility.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Collection;

@Entity @Table(name = "COURSE")
@Data @NoArgsConstructor @AllArgsConstructor
public class Course {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "COURSE_ID")
    private Long courseId;
    @ManyToOne @JoinColumn(name = "SPORT_ID")
    private Sport sport;
    @ManyToOne @JoinColumn(name = "COACH_ID")
    private Coach coach;
    @Column(name = "START_TIME") private String startTime;
    @Column(name = "END_TIME") private String endTime;
    private Integer duration;
    private Double fee;
    @Column(name = "MAX_STUDENTS") private Integer maxStudents;

    public Collection<Object> getEnrollments() {
        return null;
    }
}