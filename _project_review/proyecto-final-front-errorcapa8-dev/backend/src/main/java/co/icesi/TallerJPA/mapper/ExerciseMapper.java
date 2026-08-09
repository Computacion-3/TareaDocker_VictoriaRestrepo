package co.icesi.TallerJPA.mapper;

import org.springframework.stereotype.Component;

import co.icesi.TallerJPA.dto.response.ExerciseResponseDTO;
import co.icesi.TallerJPA.model.Exercise;

@Component
public class ExerciseMapper {

    public ExerciseResponseDTO toResponseDTO(Exercise exercise) {

        ExerciseResponseDTO dto = new ExerciseResponseDTO();

        dto.setId(exercise.getId());
        dto.setName(exercise.getName());
        dto.setType(exercise.getType());
        dto.setDescription(exercise.getDescription());
        dto.setDuration(exercise.getDuration());
        dto.setDifficulty(exercise.getDifficulty());
        dto.setVideoUrl(exercise.getVideoUrl());
        dto.setActive(exercise.isActive());
        dto.setCustom(exercise.isCustom());
        if (exercise.getCreatedBy() != null) {
            dto.setCreatedById(exercise.getCreatedBy().getId());
            dto.setCreatedByName(exercise.getCreatedBy().getName());
        }
        dto.setCreatedAt(exercise.getCreatedAt());
        dto.setUpdatedAt(exercise.getUpdatedAt());

        return dto;
    }
}
