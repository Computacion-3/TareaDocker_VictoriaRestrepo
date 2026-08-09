package co.icesi.TallerJPA.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Data;

@Data
public class ProgressRequestDTO {

    @NotNull
    @JsonAlias("dateCreation")
    private LocalDate date;

    private String periodType;

    @PositiveOrZero
    private Integer repetitions;

    private Integer timeMinutes;

    @NotBlank
    @JsonAlias("level")
    private String effortLevel;

    private BigDecimal weight;

    @JsonAlias("observations")
    private String notes;

    private Long userId;

    private Long routineId;

    private Long exerciseId;
}
