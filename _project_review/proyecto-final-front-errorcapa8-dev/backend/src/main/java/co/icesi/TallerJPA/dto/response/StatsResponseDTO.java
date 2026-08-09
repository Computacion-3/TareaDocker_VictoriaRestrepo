package co.icesi.TallerJPA.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import lombok.Data;

@Data
public class StatsResponseDTO {

    private Long userId;
    private String userName;
    private String period;
    private LocalDate startDate;
    private LocalDate endDate;
    private long totalProgressEntries;
    private long totalMinutes;
    private long totalRepetitions;
    private Double averageEffortLevel;
    private BigDecimal totalWeightVolume;
    private List<StatsPointDTO> points;
}
