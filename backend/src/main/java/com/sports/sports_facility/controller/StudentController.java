package com.sports.sports_facility.controller;

import com.sports.sports_facility.model.Student;
import com.sports.sports_facility.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:3000")
public class StudentController {

    @Autowired
    private StudentRepository repo;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @GetMapping
    public List<Student> getAll() { return repo.findAll(); }

    @GetMapping("/{id}")
    public Student getById(@PathVariable Long id) { return repo.findById(id).orElse(null); }

    @PutMapping("/{id}")
    public Student update(@PathVariable Long id, @RequestBody Student s) {
        s.setStudentId(id);
        return repo.save(s);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { repo.deleteById(id); }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody Student s) {
        if (s.getName() == null || s.getEmail() == null || s.getPassword() == null) {
            return ResponseEntity.badRequest().body("All fields are required");
        }
        if (repo.existsByEmail(s.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        // Always let the DB auto-generate the ID — prevents optimistic locking conflict
        s.setStudentId(null);

        s.setPassword(passwordEncoder.encode(s.getPassword()));
        repo.save(s);
        return ResponseEntity.ok("Student account created successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Student s) {
        // findByEmail now correctly returns Optional<Student>
        return repo.findByEmail(s.getEmail()).map(student -> {
            if (passwordEncoder.matches(s.getPassword(), student.getPassword())) {
                return ResponseEntity.ok((Object) student); // return full student object so frontend gets name, studentId etc.
            } else {
                return ResponseEntity.badRequest().body((Object) "Invalid password");
            }
        }).orElse(ResponseEntity.badRequest().body("Student not found"));
    }
}