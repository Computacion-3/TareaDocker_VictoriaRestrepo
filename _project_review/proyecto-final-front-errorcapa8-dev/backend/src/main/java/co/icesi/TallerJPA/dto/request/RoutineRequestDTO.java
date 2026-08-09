package co.icesi.TallerJPA.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.Data;

@Data
public class RoutineRequestDTO {

    @NotBlank
    private String name;

    @NotBlank
    private String description;

    private Long ownerId;

    private Long createdById;

    private boolean predefined;

    @JsonAlias("excerciseIds")
    private List<Long> exerciseIds;

    private List<RoutineExerciseRequestDTO> exerciseDetails;
}
