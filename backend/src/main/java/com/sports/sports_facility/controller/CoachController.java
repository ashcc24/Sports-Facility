package com.sports.sports_facility.controller;

import com.sports.sports_facility.model.Coach;
import com.sports.sports_facility.repository.CoachRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/coaches")
@CrossOrigin(origins = "http://localhost:3000")
public class CoachController {
    @Autowired CoachRepository repo;
    @GetMapping public List<Coach> getAll() { return repo.findAll(); }
    @PostMapping public Coach create(@RequestBody Coach c) { return repo.save(c); }
    @DeleteMapping("/{id}") public void delete(@PathVariable Long id) { repo.deleteById(id); }
}