package co.icesi.TallerJPA.controller.rest;

import co.icesi.TallerJPA.dto.request.TrainerAssignmentRequestDTO;
import co.icesi.TallerJPA.dto.response.TrainerAssignmentResponseDTO;
import co.icesi.TallerJPA.mapper.TrainerAssignmentMapper;
import co.icesi.TallerJPA.services.TrainerAssignmentService;
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
@RequestMapping("/api/v1/trainer-assignments")
public class TrainerAssignmentRestController {

    private final TrainerAssignmentService trainerAssignmentService;
    private final TrainerAssignmentMapper trainerAssignmentMapper;

    public TrainerAssignmentRestController(
            TrainerAssignmentService trainerAssignmentService,
            TrainerAssignmentMapper trainerAssignmentMapper
    ) {
        this.trainerAssignmentService = trainerAssignmentService;
        this.trainerAssignmentMapper = trainerAssignmentMapper;
    }

    @GetMapping
    public List<TrainerAssignmentResponseDTO> getAll() {
        return trainerAssignmentService.findAll().stream().map(trainerAssignmentMapper::toResponseDTO).toList();
    }

    @GetMapping("/{id}")
    public TrainerAssignmentResponseDTO getById(@PathVariable Long id) {
        return trainerAssignmentMapper.toResponseDTO(trainerAssignmentService.findById(id));
    }

    @PostMapping
    public TrainerAssignmentResponseDTO create(@Valid @RequestBody TrainerAssignmentRequestDTO dto) {
        return trainerAssignmentMapper.toResponseDTO(trainerAssignmentService.create(dto));
    }

    @PutMapping("/{id}")
    public TrainerAssignmentResponseDTO update(
            @PathVariable Long id,
            @Valid @RequestBody TrainerAssignmentRequestDTO dto
    ) {
        return trainerAssignmentMapper.toResponseDTO(trainerAssignmentService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        trainerAssignmentService.delete(id);
    }
}
