package com.sports.sports_facility.controller;

import com.sports.sports_facility.model.Payment;
import com.sports.sports_facility.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {
    @Autowired PaymentRepository repo;
    @GetMapping public List<Payment> getAll() { return repo.findAll(); }
    @GetMapping("/student/{id}") public List<Payment> getByStudent(@PathVariable Long id) {
        return repo.findByStudentStudentId(id);
    }
    @PostMapping public Payment create(@RequestBody Payment p) { return repo.save(p); }
    @PutMapping("/{id}") public Payment update(@PathVariable Long id, @RequestBody Payment p) {
        p.setPaymentId(id); return repo.save(p);
    }
}