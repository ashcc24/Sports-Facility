package com.sports.sports_facility.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity @Table(name = "STUDENT")
@Data @NoArgsConstructor @AllArgsConstructor
public class Student {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "STUDENT_ID")
    private Long studentId;
    private String name;
    @Column(unique = true) private String email;
    private String password;
    private String phone;
    @Column(name = "DATE_OF_BIRTH")
    private LocalDate dateOfBirth;
}