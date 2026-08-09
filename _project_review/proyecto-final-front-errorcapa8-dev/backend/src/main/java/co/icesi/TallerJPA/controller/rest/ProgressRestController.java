package co.icesi.TallerJPA.controller.rest;

import co.icesi.TallerJPA.dto.request.ProgressRequestDTO;
import co.icesi.TallerJPA.dto.response.ProgressResponseDTO;
import co.icesi.TallerJPA.mapper.ProgressMapper;
import co.icesi.TallerJPA.services.AuthContextService;
import co.icesi.TallerJPA.services.ProgressService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/progress")
public class ProgressRestController {

    private final ProgressService progressService;
    private final ProgressMapper progressMapper;
    private final AuthContextService authContextService;

    public ProgressRestController(
            ProgressService progressService,
            ProgressMapper progressMapper,
            AuthContextService authContextService
    ) {
        this.progressService = progressService;
        this.progressMapper = progressMapper;
        this.authContextService = authContextService;
    }

    @GetMapping
    public List<ProgressResponseDTO> getAll() {
        authContextService.requireAdmin();

        return progressService.findAll()
                .stream()
                .map(progressMapper::toResponseDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public ProgressResponseDTO getById(@PathVariable Long id) {

        return progressMapper.toResponseDTO(
                progressService.findByIdForCurrent(id)
        );
    }

    @PostMapping
    public ProgressResponseDTO create(
            @Valid @RequestBody ProgressRequestDTO dto
    ) {

        return progressMapper.toResponseDTO(
                progressService.saveForCurrentUser(dto)
        );
    }

    @PutMapping("/{id}")
    public ProgressResponseDTO update(
            @PathVariable Long id,
            @Valid @RequestBody ProgressRequestDTO dto
    ) {

        return progressMapper.toResponseDTO(
                progressService.update(id, dto)
        );
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {

        progressService.delete(id);
    }

    @GetMapping("/me")
    public List<ProgressResponseDTO> getMine() {
        return progressService.findMine()
                .stream()
                .map(progressMapper::toResponseDTO)
                .toList();
    }

    @GetMapping("/me/history")
    public List<ProgressResponseDTO> getMyHistory() {
        return progressService.findMyHistory()
                .stream()
                .map(progressMapper::toResponseDTO)
                .toList();
    }

    @GetMapping("/user/{userId}")
    public List<ProgressResponseDTO> getByUser(@PathVariable Long userId) {
        return progressService.findByUserForCurrent(userId)
                .stream()
                .map(progressMapper::toResponseDTO)
                .toList();
    }

    @GetMapping("/me/routine/{routineId}")
    public List<ProgressResponseDTO> getMineByRoutine(@PathVariable Long routineId) {
        return progressService.findMineByRoutine(routineId)
                .stream()
                .map(progressMapper::toResponseDTO)
                .toList();
    }

    @GetMapping("/me/exercise/{exerciseId}")
    public List<ProgressResponseDTO> getMineByExercise(@PathVariable Long exerciseId) {
        return progressService.findMineByExercise(exerciseId)
                .stream()
                .map(progressMapper::toResponseDTO)
                .toList();
    }
}
