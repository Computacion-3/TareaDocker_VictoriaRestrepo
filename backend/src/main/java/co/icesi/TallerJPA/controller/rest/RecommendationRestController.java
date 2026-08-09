package co.icesi.TallerJPA.controller.rest;

import co.icesi.TallerJPA.dto.request.RecommendationRequestDTO;
import co.icesi.TallerJPA.dto.response.RecommendationResponseDTO;
import co.icesi.TallerJPA.mapper.RecommendationMapper;
import co.icesi.TallerJPA.services.RecommendationService;
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
@RequestMapping("/api/v1/recommendations")
public class RecommendationRestController {

    private final RecommendationService recommendationService;
    private final RecommendationMapper recommendationMapper;

    public RecommendationRestController(
            RecommendationService recommendationService,
            RecommendationMapper recommendationMapper
    ) {
        this.recommendationService = recommendationService;
        this.recommendationMapper = recommendationMapper;
    }

    @GetMapping
    public List<RecommendationResponseDTO> getAll() {
        return recommendationService.findAll().stream().map(recommendationMapper::toResponseDTO).toList();
    }

    @GetMapping("/{id}")
    public RecommendationResponseDTO getById(@PathVariable Long id) {
        return recommendationMapper.toResponseDTO(recommendationService.findById(id));
    }

    @GetMapping("/me")
    public List<RecommendationResponseDTO> getMine() {
        return recommendationService.findMine().stream().map(recommendationMapper::toResponseDTO).toList();
    }

    @GetMapping("/user/{userId}")
    public List<RecommendationResponseDTO> getByUser(@PathVariable Long userId) {
        return recommendationService.findByUserForCurrent(userId)
                .stream()
                .map(recommendationMapper::toResponseDTO)
                .toList();
    }

    @PostMapping("/users/{userId}")
    public RecommendationResponseDTO createForUser(
            @PathVariable Long userId,
            @Valid @RequestBody RecommendationRequestDTO dto
    ) {
        return recommendationMapper.toResponseDTO(recommendationService.createForUser(userId, dto));
    }

    @PutMapping("/{id}")
    public RecommendationResponseDTO update(
            @PathVariable Long id,
            @Valid @RequestBody RecommendationRequestDTO dto
    ) {
        return recommendationMapper.toResponseDTO(recommendationService.update(id, dto));
    }

    @PutMapping("/{id}/read")
    public RecommendationResponseDTO markAsRead(@PathVariable Long id) {
        return recommendationMapper.toResponseDTO(recommendationService.markAsRead(id));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        recommendationService.delete(id);
    }
}
