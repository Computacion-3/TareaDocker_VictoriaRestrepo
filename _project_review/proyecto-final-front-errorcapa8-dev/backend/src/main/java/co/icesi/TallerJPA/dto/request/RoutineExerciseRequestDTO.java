package co.icesi.TallerJPA.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoutineExerciseRequestDTO {

    @NotNull
    private Long exerciseId;

    private Integer sets;
    private Integer repetitions;
    private Integer duration;
    private Integer orderIndex;
    private String notes;
}
