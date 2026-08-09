package co.icesi.TallerJPA.controller.rest;

import co.icesi.TallerJPA.dto.request.EventRequestDTO;
import co.icesi.TallerJPA.dto.response.EventResponseDTO;
import co.icesi.TallerJPA.mapper.EventMapper;
import co.icesi.TallerJPA.services.AuthContextService;
import co.icesi.TallerJPA.services.EventService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/events")
public class EventRestController {

    private final EventService eventService;
    private final EventMapper eventMapper;
    private final AuthContextService authContextService;

    public EventRestController(
            EventService eventService,
            EventMapper eventMapper,
            AuthContextService authContextService
    ) {
        this.eventService = eventService;
        this.eventMapper = eventMapper;
        this.authContextService = authContextService;
    }

    @GetMapping
    public List<EventResponseDTO> getAll() {

        return eventService.findAll()
                .stream()
                .map(eventMapper::toResponseDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public EventResponseDTO getById(@PathVariable Long id) {

        return eventMapper.toResponseDTO(
                eventService.findById(id)
        );
    }

    @PostMapping
    public EventResponseDTO create(
            @Valid @RequestBody EventRequestDTO dto
    ) {
        authContextService.requireAdmin();

        return eventMapper.toResponseDTO(
                eventService.save(dto)
        );
    }

    @PutMapping("/{id}")
    public EventResponseDTO update(
            @PathVariable Long id,
            @Valid @RequestBody EventRequestDTO dto
    ) {
        authContextService.requireAdmin();

        return eventMapper.toResponseDTO(
                eventService.update(id, dto)
        );
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        authContextService.requireAdmin();

        eventService.delete(id);
    }

    @GetMapping("/upcoming")
    public List<EventResponseDTO> upcoming() {
        return eventService.findUpcoming()
                .stream()
                .map(eventMapper::toResponseDTO)
                .toList();
    }

    @GetMapping("/space/{spaceId}")
    public List<EventResponseDTO> bySpace(@PathVariable Long spaceId) {
        return eventService.findBySpace(spaceId)
                .stream()
                .map(eventMapper::toResponseDTO)
                .toList();
    }
}
