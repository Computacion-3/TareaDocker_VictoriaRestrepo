package co.icesi.TallerJPA.mapper;

import co.icesi.TallerJPA.dto.response.RecommendationResponseDTO;
import co.icesi.TallerJPA.model.Recommendation;
import org.springframework.stereotype.Component;

@Component
public class RecommendationMapper {

    public RecommendationResponseDTO toResponseDTO(Recommendation recommendation) {
        RecommendationResponseDTO dto = new RecommendationResponseDTO();
        dto.setId(recommendation.getId());
        if (recommendation.getTrainer() != null) {
            dto.setTrainerId(recommendation.getTrainer().getId());
            dto.setTrainerName(recommendation.getTrainer().getName());
        }
        if (recommendation.getTargetUser() != null) {
            dto.setTargetUserId(recommendation.getTargetUser().getId());
            dto.setTargetUserName(recommendation.getTargetUser().getName());
        }
        dto.setTitle(recommendation.getTitle());
        dto.setMessage(recommendation.getMessage());
        dto.setCreatedAt(recommendation.getCreatedAt());
        dto.setRead(recommendation.isRead());
        if (recommendation.getRelatedProgress() != null) {
            dto.setRelatedProgressId(recommendation.getRelatedProgress().getId());
        }
        if (recommendation.getRelatedRoutine() != null) {
            dto.setRelatedRoutineId(recommendation.getRelatedRoutine().getId());
        }
        return dto;
    }
}
