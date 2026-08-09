package co.icesi.TallerJPA.dto.response;

import java.time.LocalDate;
import lombok.Data;

@Data
public class StatsPointDTO {

    private String label;
    private LocalDate date;
    private long totalMinutes;
    private long totalRepetitions;
    private Double averageEffortLevel;
    private long entriesCount;
}
