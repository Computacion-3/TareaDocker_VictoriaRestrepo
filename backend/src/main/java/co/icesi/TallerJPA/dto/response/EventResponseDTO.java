package co.icesi.TallerJPA.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
public class EventResponseDTO {

    private Long id;
    private String name;
    private String description;
    private String eventType;
    private LocalDateTime dateTime;
    private LocalDateTime endDateTime;
    private Integer capacity;
    private String location;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<SpaceResponseDTO> spaces;
    private List<UserResponseDTO> users;
    private Long createdById;
    private String createdByName;
}
