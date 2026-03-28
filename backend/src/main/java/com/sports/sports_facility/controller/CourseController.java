package com.sports.sports_facility.controller;

import com.sports.sports_facility.model.Course;
import com.sports.sports_facility.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:3000")
public class CourseController {
    @Autowired CourseRepository repo;
    @GetMapping public List<Course> getAll() { return repo.findAll(); }
    @PostMapping public Course create(@RequestBody Course c) { return repo.save(c); }
    @DeleteMapping("/{id}") public void delete(@PathVariable Long id) { repo.deleteById(id); }
}