package co.icesi.TallerJPA.mapper;

import co.icesi.TallerJPA.dto.response.RoutineExerciseResponseDTO;
import co.icesi.TallerJPA.model.RoutineExercise;
import org.springframework.stereotype.Component;

@Component
public class RoutineExerciseMapper {

    public RoutineExerciseResponseDTO toResponseDTO(RoutineExercise routineExercise) {
        RoutineExerciseResponseDTO dto = new RoutineExerciseResponseDTO();
        dto.setId(routineExercise.getId());
        if (routineExercise.getRoutine() != null) {
            dto.setRoutineId(routineExercise.getRoutine().getId());
        }
        if (routineExercise.getExercise() != null) {
            dto.setExerciseId(routineExercise.getExercise().getId());
            dto.setExerciseName(routineExercise.getExercise().getName());
        }
        dto.setSets(routineExercise.getSets());
        dto.setRepetitions(routineExercise.getRepetitions());
        dto.setDuration(routineExercise.getDuration());
        dto.setOrderIndex(routineExercise.getOrderIndex());
        dto.setNotes(routineExercise.getNotes());
        return dto;
    }
}
