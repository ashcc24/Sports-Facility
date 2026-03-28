package com.sports.sports_facility.controller;

import com.sports.sports_facility.model.CourtBooking;
import com.sports.sports_facility.repository.CourtBookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class CourtBookingController {
    @Autowired CourtBookingRepository repo;
    @GetMapping public List<CourtBooking> getAll() { return repo.findAll(); }
    @GetMapping("/student/{id}") public List<CourtBooking> getByStudent(@PathVariable Long id) {
        return repo.findByStudentStudentId(id);
    }
    @PostMapping public CourtBooking create(@RequestBody CourtBooking b) { return repo.save(b); }
}