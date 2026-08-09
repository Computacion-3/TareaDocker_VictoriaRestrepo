package co.icesi.TallerJPA.dto.response;

import lombok.Data;

@Data
public class RoutineExerciseResponseDTO {

    private Long id;
    private Long routineId;
    private Long exerciseId;
    private String exerciseName;
    private Integer sets;
    private Integer repetitions;
    private Integer duration;
    private Integer orderIndex;
    private String notes;
}
