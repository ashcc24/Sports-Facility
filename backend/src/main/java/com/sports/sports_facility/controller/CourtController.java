package com.sports.sports_facility.controller;

import com.sports.sports_facility.model.Court;
import com.sports.sports_facility.repository.CourtRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/courts")
@CrossOrigin(origins = "http://localhost:3000")
public class CourtController {
    @Autowired CourtRepository repo;
    @GetMapping public List<Court> getAll() { return repo.findAll(); }
    @PostMapping public Court create(@RequestBody Court c) { return repo.save(c); }
}