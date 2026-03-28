package com.sports.sports_facility.controller;

import com.sports.sports_facility.model.Enrollment;
import com.sports.sports_facility.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "http://localhost:3000")
public class EnrollmentController {
    @Autowired EnrollmentRepository repo;
    @GetMapping public List<Enrollment> getAll() { return repo.findAll(); }
    @GetMapping("/student/{id}") public List<Enrollment> getByStudent(@PathVariable Long id) {
        return repo.findByStudentStudentId(id);
    }
    @PostMapping public Enrollment create(@RequestBody Enrollment e) { return repo.save(e); }
}