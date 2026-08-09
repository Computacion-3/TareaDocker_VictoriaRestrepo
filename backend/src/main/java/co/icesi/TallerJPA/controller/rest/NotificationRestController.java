package co.icesi.TallerJPA.controller.rest;

import co.icesi.TallerJPA.dto.request.NotificationRequestDTO;
import co.icesi.TallerJPA.dto.response.NotificationResponseDTO;
import co.icesi.TallerJPA.mapper.NotificationMapper;
import co.icesi.TallerJPA.services.NotificationService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationRestController {

    private final NotificationService notificationService;
    private final NotificationMapper notificationMapper;

    public NotificationRestController(
            NotificationService notificationService,
            NotificationMapper notificationMapper
    ) {
        this.notificationService = notificationService;
        this.notificationMapper = notificationMapper;
    }

    @GetMapping
    public List<NotificationResponseDTO> getAll() {

        return notificationService.findAll()
                .stream()
                .map(notificationMapper::toResponseDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public NotificationResponseDTO getById(@PathVariable Long id) {

        return notificationMapper.toResponseDTO(
                notificationService.findById(id)
        );
    }

    @PostMapping
    public NotificationResponseDTO create(
            @Valid @RequestBody NotificationRequestDTO dto
    ) {

        return notificationMapper.toResponseDTO(
                notificationService.save(dto)
        );
    }

    @PutMapping("/{id}")
    public NotificationResponseDTO update(
            @PathVariable Long id,
            @Valid @RequestBody NotificationRequestDTO dto
    ) {

        return notificationMapper.toResponseDTO(
                notificationService.update(id, dto)
        );
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {

        notificationService.delete(id);
    }

    @GetMapping("/me")
    public List<NotificationResponseDTO> getMine() {
        return notificationService.findMine()
                .stream()
                .map(notificationMapper::toResponseDTO)
                .toList();
    }

    @PutMapping("/{id}/read")
    public NotificationResponseDTO markAsRead(@PathVariable Long id) {
        return notificationMapper.toResponseDTO(notificationService.markAsRead(id));
    }
}
