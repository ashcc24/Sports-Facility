package com.sports.sports_facility.controller;

import com.sports.sports_facility.model.Achievement;
import com.sports.sports_facility.repository.AchievementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/achievements")
@CrossOrigin(origins = "http://localhost:3000")
public class AchievementController {
    @Autowired AchievementRepository repo;
    @GetMapping public List<Achievement> getAll() { return repo.findAll(); }
    @PostMapping public Achievement create(@RequestBody Achievement a) { return repo.save(a); }
    @DeleteMapping("/{id}") public void delete(@PathVariable Long id) { repo.deleteById(id); }
}