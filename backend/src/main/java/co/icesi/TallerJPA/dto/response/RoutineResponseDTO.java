package co.icesi.TallerJPA.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
public class RoutineResponseDTO {

    private Long id;
    private String name;
    private String description;
    private Long ownerId;
    private String ownerName;
    private Long createdById;
    private String createdByName;
    private boolean predefined;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ExerciseResponseDTO> exercises;
    private List<RoutineExerciseResponseDTO> exerciseDetails;
}
