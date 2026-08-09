package co.icesi.TallerJPA.mapper;

import org.springframework.stereotype.Component;

import co.icesi.TallerJPA.dto.response.ProgressResponseDTO;
import co.icesi.TallerJPA.model.Progress;

@Component
public class ProgressMapper {

    public ProgressResponseDTO toResponseDTO(Progress progress) {

        ProgressResponseDTO dto = new ProgressResponseDTO();

        dto.setId(progress.getId());
        dto.setDate(progress.getDate());
        dto.setPeriodType(progress.getPeriodType());
        dto.setRepetitions(progress.getRepetitions());
        dto.setTimeMinutes(progress.getTimeMinutes());
        dto.setEffortLevel(progress.getEffortLevel());
        dto.setWeight(progress.getWeight());
        dto.setNotes(progress.getNotes());
        dto.setCreatedAt(progress.getCreatedAt());

        if (progress.getUser() != null) {
            dto.setUserId(progress.getUser().getId());
            dto.setUserName(progress.getUser().getName());
        }

        if (progress.getRoutine() != null) {
            dto.setRoutineId(progress.getRoutine().getId());
            dto.setRoutineName(progress.getRoutine().getName());
        }

        if (progress.getExercise() != null) {
            dto.setExerciseId(progress.getExercise().getId());
            dto.setExerciseName(progress.getExercise().getName());
        }

        return dto;
    }
}
