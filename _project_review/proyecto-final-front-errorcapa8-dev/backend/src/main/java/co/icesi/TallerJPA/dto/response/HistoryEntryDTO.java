package co.icesi.TallerJPA.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Data;

@Data
public class HistoryEntryDTO {

    private Long progressId;
    private LocalDate date;
    private String periodType;
    private Long routineId;
    private String routineName;
    private Long exerciseId;
    private String exerciseName;
    private Integer repetitions;
    private Integer timeMinutes;
    private String effortLevel;
    private BigDecimal weight;
    private String notes;
}
