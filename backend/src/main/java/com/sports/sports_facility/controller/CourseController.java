package com.sports.sports_facility.controller;

import com.sports.sports_facility.model.Coach;
import com.sports.sports_facility.model.Course;
import com.sports.sports_facility.repository.CoachRepository;
import com.sports.sports_facility.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:3000")
public class CourseController {

    @Autowired
    CourseRepository repo;

    @Autowired
    CoachRepository coachRepo;

    @GetMapping
    public List<Course> getAll() {
        return repo.findAllWithDetails();
    }

    @PostMapping
    public Course create(@RequestBody Course c) {
        return repo.save(c);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Assign a coach to an existing course
    @PatchMapping("/{courseId}/assign-coach/{coachId}")
    public ResponseEntity<Course> assignCoach(
            @PathVariable Long courseId,
            @PathVariable Long coachId) {

        Course course = repo.findById(courseId)
                .orElse(null);
        if (course == null) return ResponseEntity.notFound().build();

        Coach coach = coachRepo.findById(coachId)
                .orElse(null);
        if (coach == null) return ResponseEntity.notFound().build();

        course.setCoach(coach);
        return ResponseEntity.ok(repo.save(course));
    }

    // Remove coach from a course
    @PatchMapping("/{courseId}/remove-coach")
    public ResponseEntity<Course> removeCoach(@PathVariable Long courseId) {
        Course course = repo.findById(courseId)
                .orElse(null);
        if (course == null) return ResponseEntity.notFound().build();

        course.setCoach(null);
        return ResponseEntity.ok(repo.save(course));
    }
}