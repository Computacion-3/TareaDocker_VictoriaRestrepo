package co.icesi.TallerJPA.dto.response;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class SpaceResponseDTO {

    private Long id;
    private String name;
    private String type;
    private String description;
    private String location;
    private boolean available;
    private int capacity;
    private String openingHours;
    private String closingHours;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
