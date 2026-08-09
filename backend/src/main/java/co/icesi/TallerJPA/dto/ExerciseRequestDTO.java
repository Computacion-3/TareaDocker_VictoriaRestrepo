package co.icesi.TallerJPA.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class ExerciseRequestDTO {

    @NotBlank
    private String name;

    @NotBlank
    private String type;

    @NotBlank
    private String description;

    @Positive
    private Integer duration;

    @NotBlank
    private String difficulty;

    private String videoUrl;
}
