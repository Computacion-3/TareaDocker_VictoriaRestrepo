package co.icesi.TallerJPA.dto.response;

import java.time.LocalDate;
import lombok.Data;

@Data
public class HistorySummaryDTO {

    private long totalProgressEntries;
    private long totalMinutes;
    private long totalRepetitions;
    private Double averageEffortLevel;
    private LocalDate lastActivityDate;
    private long completedRoutineCount;
    private long activeRoutineCount;
}
