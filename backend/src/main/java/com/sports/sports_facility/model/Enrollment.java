package com.sports.sports_facility.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "ENROLLMENT")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ENROLLMENT_ID")
    private Long enrollmentId;

    @ManyToOne
    @JoinColumn(name = "STUDENT_ID")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "COURSE_ID")
    private Course course;

    @Column(name = "ENROLLMENT_DATE")
    private LocalDate enrollmentDate;

    private String status;

    @PrePersist
    public void checkOverbooking() {
        if (course != null && course.getEnrollments() != null &&
                course.getEnrollments().size() >= course.getMaxStudents()) {
            this.status = "WAITLISTED";
        } else {
            this.status = "ENROLLED";
        }
    }
}