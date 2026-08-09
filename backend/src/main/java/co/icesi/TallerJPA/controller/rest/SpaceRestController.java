package co.icesi.TallerJPA.controller.rest;

import co.icesi.TallerJPA.dto.request.SpaceRequestDTO;
import co.icesi.TallerJPA.dto.response.SpaceResponseDTO;
import co.icesi.TallerJPA.mapper.SpaceMapper;
import co.icesi.TallerJPA.services.AuthContextService;
import co.icesi.TallerJPA.services.SpaceService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/v1/spaces", "/api/v1/espacios"})
public class SpaceRestController {

    private final SpaceService spaceService;
    private final SpaceMapper spaceMapper;
    private final AuthContextService authContextService;

    public SpaceRestController(
            SpaceService spaceService,
            SpaceMapper spaceMapper,
            AuthContextService authContextService
    ) {
        this.spaceService = spaceService;
        this.spaceMapper = spaceMapper;
        this.authContextService = authContextService;
    }

    @GetMapping
    public List<SpaceResponseDTO> getAll() {

        return spaceService.findAll()
                .stream()
                .map(spaceMapper::toResponseDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public SpaceResponseDTO getById(@PathVariable Long id) {

        return spaceMapper.toResponseDTO(
                spaceService.findById(id)
        );
    }

    @PostMapping
    public SpaceResponseDTO create(
            @Valid @RequestBody SpaceRequestDTO dto
    ) {
        authContextService.requireAdmin();

        return spaceMapper.toResponseDTO(
                spaceService.save(dto)
        );
    }

    @PutMapping("/{id}")
    public SpaceResponseDTO update(
            @PathVariable Long id,
            @Valid @RequestBody SpaceRequestDTO dto
    ) {
        authContextService.requireAdmin();

        return spaceMapper.toResponseDTO(
                spaceService.update(id, dto)
        );
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        authContextService.requireAdmin();

        spaceService.delete(id);
    }
}
