package co.icesi.TallerJPA.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class EventResponseDTO {

    private Long id;
    private String name;
    private String description;
    private LocalDateTime dateTime;
    private String location;

    private List<Long> spaceIds;
    private List<Long> userIds;
}
