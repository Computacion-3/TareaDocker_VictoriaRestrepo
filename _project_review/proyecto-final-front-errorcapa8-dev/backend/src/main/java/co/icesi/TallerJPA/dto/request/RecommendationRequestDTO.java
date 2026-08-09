package co.icesi.TallerJPA.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RecommendationRequestDTO {

    @NotBlank
    private String title;

    @NotBlank
    private String message;

    private Long relatedProgressId;
    private Long relatedRoutineId;
}
