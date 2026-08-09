package co.icesi.TallerJPA.controller.rest;

import co.icesi.TallerJPA.dto.request.RoutineExerciseRequestDTO;
import co.icesi.TallerJPA.dto.response.RoutineExerciseResponseDTO;
import co.icesi.TallerJPA.mapper.RoutineExerciseMapper;
import co.icesi.TallerJPA.services.RoutineExerciseService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/routine-exercises")
public class RoutineExerciseRestController {

    private final RoutineExerciseService routineExerciseService;
    private final RoutineExerciseMapper routineExerciseMapper;

    public RoutineExerciseRestController(
            RoutineExerciseService routineExerciseService,
            RoutineExerciseMapper routineExerciseMapper
    ) {
        this.routineExerciseService = routineExerciseService;
        this.routineExerciseMapper = routineExerciseMapper;
    }

    @GetMapping
    public List<RoutineExerciseResponseDTO> getAll() {
        return routineExerciseService.findAll().stream().map(routineExerciseMapper::toResponseDTO).toList();
    }

    @GetMapping("/{id}")
    public RoutineExerciseResponseDTO getById(@PathVariable Long id) {
        return routineExerciseMapper.toResponseDTO(routineExerciseService.findById(id));
    }

    @PostMapping("/routine/{routineId}")
    public RoutineExerciseResponseDTO create(
            @PathVariable Long routineId,
            @Valid @RequestBody RoutineExerciseRequestDTO dto
    ) {
        return routineExerciseMapper.toResponseDTO(routineExerciseService.create(routineId, dto));
    }

    @PostMapping
    public RoutineExerciseResponseDTO createWithoutRoutine(@Valid @RequestBody RoutineExerciseRequestDTO dto) {
        throw new co.icesi.TallerJPA.exception.BadRequestException("Use /api/v1/routine-exercises/routine/{routineId}");
    }

    @PutMapping("/{id}")
    public RoutineExerciseResponseDTO update(
            @PathVariable Long id,
            @Valid @RequestBody RoutineExerciseRequestDTO dto
    ) {
        return routineExerciseMapper.toResponseDTO(routineExerciseService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        routineExerciseService.delete(id);
    }
}
