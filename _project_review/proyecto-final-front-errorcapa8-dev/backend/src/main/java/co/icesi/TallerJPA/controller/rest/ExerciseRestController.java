package co.icesi.TallerJPA.controller.rest;

import co.icesi.TallerJPA.dto.request.ExerciseRequestDTO;
import co.icesi.TallerJPA.dto.response.ExerciseResponseDTO;
import co.icesi.TallerJPA.mapper.ExerciseMapper;
import co.icesi.TallerJPA.services.AuthContextService;
import co.icesi.TallerJPA.services.ExerciseService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/v1/exercises", "/api/v1/excercises"})
public class ExerciseRestController {

    private final ExerciseService exerciseService;
    private final ExerciseMapper exerciseMapper;
    private final AuthContextService authContextService;

    public ExerciseRestController(
            ExerciseService exerciseService,
            ExerciseMapper exerciseMapper,
            AuthContextService authContextService
    ) {
        this.exerciseService = exerciseService;
        this.exerciseMapper = exerciseMapper;
        this.authContextService = authContextService;
    }

    @GetMapping
    public List<ExerciseResponseDTO> getAll() {

        return exerciseService.findAll()
                .stream()
                .map(exerciseMapper::toResponseDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public ExerciseResponseDTO getById(@PathVariable Long id) {

        return exerciseMapper.toResponseDTO(
                exerciseService.findById(id)
        );
    }

    @GetMapping("/available")
    public List<ExerciseResponseDTO> getAvailable() {
        return exerciseService.findAvailableForCurrent()
                .stream()
                .map(exerciseMapper::toResponseDTO)
                .toList();
    }

    @GetMapping("/custom/me")
    public List<ExerciseResponseDTO> getMyCustomExercises() {
        return exerciseService.findCustomMine()
                .stream()
                .map(exerciseMapper::toResponseDTO)
                .toList();
    }

    @PostMapping
    public ExerciseResponseDTO create(
            @Valid @RequestBody ExerciseRequestDTO dto
    ) {
        authContextService.requireAdmin();

        return exerciseMapper.toResponseDTO(
                exerciseService.save(dto)
        );
    }

    @PostMapping("/custom")
    public ExerciseResponseDTO createCustom(
            @Valid @RequestBody ExerciseRequestDTO dto
    ) {
        return exerciseMapper.toResponseDTO(
                exerciseService.saveCustom(dto)
        );
    }

    @PutMapping("/{id}")
    public ExerciseResponseDTO update(
            @PathVariable Long id,
            @Valid @RequestBody ExerciseRequestDTO dto
    ) {
        authContextService.requireAdmin();

        return exerciseMapper.toResponseDTO(
                exerciseService.update(id, dto)
        );
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        authContextService.requireAdmin();

        exerciseService.delete(id);
    }
}
