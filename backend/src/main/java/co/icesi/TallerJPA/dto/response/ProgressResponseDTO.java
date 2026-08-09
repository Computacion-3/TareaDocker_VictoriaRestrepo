package co.icesi.TallerJPA.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class ProgressResponseDTO {

    private Long id;
    private LocalDate date;
    private String periodType;
    private Integer repetitions;
    private Integer timeMinutes;
    private String effortLevel;
    private BigDecimal weight;
    private String notes;
    private LocalDateTime createdAt;
    private Long userId;
    private String userName;
    private Long routineId;
    private String routineName;
    private Long exerciseId;
    private String exerciseName;
}
