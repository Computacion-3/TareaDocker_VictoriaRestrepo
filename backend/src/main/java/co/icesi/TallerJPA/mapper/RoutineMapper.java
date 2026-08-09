package co.icesi.TallerJPA.mapper;

import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import co.icesi.TallerJPA.dto.response.ExerciseResponseDTO;
import co.icesi.TallerJPA.dto.response.RoutineExerciseResponseDTO;
import co.icesi.TallerJPA.dto.response.RoutineResponseDTO;
import co.icesi.TallerJPA.model.Exercise;
import co.icesi.TallerJPA.model.Routine;
import co.icesi.TallerJPA.model.RoutineExercise;
import java.util.List;

@Component
public class RoutineMapper {

    public RoutineResponseDTO toResponseDTO(Routine routine) {

        RoutineResponseDTO dto = new RoutineResponseDTO();

        dto.setId(routine.getId());
        dto.setName(routine.getName());
        dto.setDescription(routine.getDescription());

        if (routine.getOwner() != null) {
            dto.setOwnerId(routine.getOwner().getId());
            dto.setOwnerName(routine.getOwner().getName());
        }

        if (routine.getCreatedBy() != null) {
            dto.setCreatedById(routine.getCreatedBy().getId());
            dto.setCreatedByName(routine.getCreatedBy().getName());
        }

        dto.setPredefined(routine.isPredefined());
        dto.setActive(routine.isActive());
        dto.setCreatedAt(routine.getCreatedAt());
        dto.setUpdatedAt(routine.getUpdatedAt());

        List<RoutineExercise> routineExercises = routine.getRoutineExercises() == null
                ? List.of()
                : routine.getRoutineExercises();

        dto.setExercises(routineExercises.stream()
                .map(RoutineExercise::getExercise)
                .map(this::toResponseDTO)
                .collect(Collectors.toList()));

        dto.setExerciseDetails(routineExercises.stream()
                .map(this::toRoutineExerciseResponseDTO)
                .collect(Collectors.toList()));

        return dto;
    }

    private ExerciseResponseDTO toResponseDTO(Exercise exercise) {
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

    private RoutineExerciseResponseDTO toRoutineExerciseResponseDTO(RoutineExercise routineExercise) {
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
