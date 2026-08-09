package co.icesi.TallerJPA.controller.rest;

import co.icesi.TallerJPA.dto.request.RoutineRequestDTO;
import co.icesi.TallerJPA.dto.response.RoutineResponseDTO;
import co.icesi.TallerJPA.mapper.RoutineMapper;
import co.icesi.TallerJPA.services.AuthContextService;
import co.icesi.TallerJPA.services.RoutineService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/routines")
public class RoutineRestController {

    private final RoutineService routineService;
    private final RoutineMapper routineMapper;
    private final AuthContextService authContextService;

    public RoutineRestController(
            RoutineService routineService,
            RoutineMapper routineMapper,
            AuthContextService authContextService
    ) {
        this.routineService = routineService;
        this.routineMapper = routineMapper;
        this.authContextService = authContextService;
    }

    @GetMapping
    public List<RoutineResponseDTO> getAll() {
        authContextService.requireAdmin();

        return routineService.findAll()
                .stream()
                .map(routineMapper::toResponseDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public RoutineResponseDTO getById(@PathVariable Long id) {
        return routineMapper.toResponseDTO(routineService.findByIdForCurrent(id));
    }

    @PostMapping
    public RoutineResponseDTO create(
            @Valid @RequestBody RoutineRequestDTO dto
    ) {

        return routineMapper.toResponseDTO(
                routineService.saveForCurrentUser(dto)
        );
    }

    @PutMapping("/{id}")
    public RoutineResponseDTO update(
            @PathVariable Long id,
            @Valid @RequestBody RoutineRequestDTO dto
    ) {

        return routineMapper.toResponseDTO(
                routineService.update(id, dto)
        );
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {

        routineService.delete(id);
    }

    @GetMapping("/me")
    public List<RoutineResponseDTO> getMine() {
        return routineService.findMine()
                .stream()
                .map(routineMapper::toResponseDTO)
                .toList();
    }

    @GetMapping("/templates")
    public List<RoutineResponseDTO> getTemplates() {
        return routineService.findTemplates()
                .stream()
                .map(routineMapper::toResponseDTO)
                .toList();
    }

    @PostMapping("/templates")
    public RoutineResponseDTO createTemplate(@Valid @RequestBody RoutineRequestDTO dto) {
        return routineMapper.toResponseDTO(routineService.createTemplate(dto));
    }

    @PostMapping("/templates/{id}/adopt")
    public RoutineResponseDTO adoptTemplate(@PathVariable Long id) {
        return routineMapper.toResponseDTO(routineService.adoptTemplate(id));
    }
}
