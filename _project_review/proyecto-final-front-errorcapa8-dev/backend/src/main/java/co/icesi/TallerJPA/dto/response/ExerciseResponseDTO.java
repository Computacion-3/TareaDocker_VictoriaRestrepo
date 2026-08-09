package co.icesi.TallerJPA.dto.response;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class ExerciseResponseDTO {

    private Long id;
    private String name;
    private String type;
    private String description;
    private Integer duration;
    private String difficulty;
    private String videoUrl;
    private boolean active;
    private boolean custom;
    private Long createdById;
    private String createdByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
