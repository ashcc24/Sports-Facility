package com.sports.sports_facility.controller;

import com.sports.sports_facility.model.Student;
import com.sports.sports_facility.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:3000")
public class StudentController {
    @Autowired StudentRepository repo;

    @GetMapping public List<Student> getAll() { return repo.findAll(); }
    @GetMapping("/{id}") public Student getById(@PathVariable Long id) { return repo.findById(id).orElse(null); }
    @PostMapping public Student create(@RequestBody Student s) { return repo.save(s); }
    @PutMapping("/{id}") public Student update(@PathVariable Long id, @RequestBody Student s) {
        s.setStudentId(id); return repo.save(s);
    }
    @DeleteMapping("/{id}") public void delete(@PathVariable Long id) { repo.deleteById(id); }

    @PostMapping("/login")
    public Student login(@RequestBody Student s) {
        return repo.findByEmailAndPassword(s.getEmail(), s.getPassword()).orElse(null);
    }
}