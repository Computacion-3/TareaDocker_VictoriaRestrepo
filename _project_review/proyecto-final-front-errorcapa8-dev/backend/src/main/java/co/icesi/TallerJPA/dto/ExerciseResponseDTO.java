package co.icesi.TallerJPA.dto;

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
}
