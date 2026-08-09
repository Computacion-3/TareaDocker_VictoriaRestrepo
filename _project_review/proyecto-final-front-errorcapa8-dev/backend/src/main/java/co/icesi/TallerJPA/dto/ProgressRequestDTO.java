package co.icesi.TallerJPA.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ProgressRequestDTO {

    @NotNull
    @JsonAlias("dateCreation")
    private LocalDate date;

    @NotNull
    private Integer repetitions;

    @NotBlank
    @JsonAlias("level")
    private String effortLevel;

    @NotBlank
    @JsonAlias("observations")
    private String notes;

    @NotNull
    private Long userId;
}
