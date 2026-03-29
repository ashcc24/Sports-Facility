package com.sports.sports_facility.controller;

import com.sports.sports_facility.dto.PerformanceDTO;
import com.sports.sports_facility.model.Performance;
import com.sports.sports_facility.repository.PerformanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/performances")
@CrossOrigin(origins = "http://localhost:3000")
public class PerformanceController {

    @Autowired
    PerformanceRepository repo;

    // ── Convert entity → DTO, filtering fields by sport ──
    private PerformanceDTO toDTO(Performance p) {
        PerformanceDTO dto = new PerformanceDTO();

        dto.setPerformanceId(p.getPerformanceId());
        dto.setStudentId(p.getStudent().getStudentId());
        dto.setStudentName(p.getStudent().getName());
        dto.setSportId(p.getSport().getSportId());
        dto.setSportName(p.getSport().getSportName());

        // Common to ALL sports
        dto.setMatchesPlayed(p.getMatchesPlayed());
        dto.setWins(p.getWins());

        // Sport-specific fields
        String sport = p.getSport().getSportName().toUpperCase();
        switch (sport) {
            case "CRICKET" -> {
                dto.setRunsScored(p.getRunsScored());
                dto.setWicketsTaken(p.getWicketsTaken());
                dto.setCatchesTaken(p.getCatchesTaken());
            }
            case "BADMINTON" -> {
                dto.setPointsScored(p.getPointsScored());
                dto.setSetsWon(p.getSetsWon());
            }
            case "BASKETBALL" -> {
                dto.setPointsScoredBasketball(p.getPointsScoredBasketball());
                dto.setAssists(p.getAssists());
                dto.setRebounds(p.getRebounds());
            }
        }
        return dto;
    }

    @GetMapping
    public List<PerformanceDTO> getAll() {
        return repo.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/student/{id}")
    public List<PerformanceDTO> getByStudent(@PathVariable Long id) {
        return repo.findByStudentStudentId(id)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    public PerformanceDTO create(@RequestBody Performance p) {
        p.setPerformanceId(null); // always insert fresh
        return toDTO(repo.save(p));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PerformanceDTO> update(@PathVariable Long id, @RequestBody Performance p) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        p.setPerformanceId(id);
        return ResponseEntity.ok(toDTO(repo.save(p)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}