package co.icesi.TallerJPA.dto.response;

import java.util.List;
import lombok.Data;

@Data
public class HistoryResponseDTO {

    private Long userId;
    private String userName;
    private String email;
    private HistorySummaryDTO summary;
    private List<HistoryEntryDTO> entries;
}
