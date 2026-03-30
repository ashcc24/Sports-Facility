package com.sports.sports_facility.controller;

import com.sports.sports_facility.model.Enrollment;
import com.sports.sports_facility.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "http://localhost:3000")
public class EnrollmentController {

    @Autowired
    EnrollmentRepository repo;

    @GetMapping
    public List<Enrollment> getAll() { return repo.findAll(); }

    @GetMapping("/student/{id}")
    public List<Enrollment> getByStudent(@PathVariable Long id) {
        return repo.findByStudentStudentId(id);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Enrollment e) {
        Long studentId = e.getStudent().getStudentId();
        Long courseId = e.getCourse().getCourseId();

        boolean alreadyEnrolled = repo.existsByStudentStudentIdAndCourseCourseId(studentId, courseId);
        if (alreadyEnrolled) {
            return ResponseEntity.badRequest().body("You are already enrolled in this course.");
        }

        return ResponseEntity.ok(repo.save(e));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}