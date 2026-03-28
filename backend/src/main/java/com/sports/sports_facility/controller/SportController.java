package com.sports.sports_facility.controller;

import com.sports.sports_facility.model.Sport;
import com.sports.sports_facility.repository.SportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sports")
@CrossOrigin(origins = "http://localhost:3000")
public class SportController {
    @Autowired SportRepository repo;
    @GetMapping public List<Sport> getAll() { return repo.findAll(); }
    @PostMapping public Sport create(@RequestBody Sport s) { return repo.save(s); }
}