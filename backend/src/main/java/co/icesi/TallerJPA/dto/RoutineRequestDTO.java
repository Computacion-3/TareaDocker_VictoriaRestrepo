package co.icesi.TallerJPA.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class RoutineRequestDTO {

    @NotBlank
    private String name;

    @NotBlank
    private String description;

    @NotNull
    private Long ownerId;

    @NotNull
    @JsonAlias("excerciseIds")
    private List<Long> exerciseIds;
}
