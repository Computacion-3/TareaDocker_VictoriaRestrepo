package co.icesi.TallerJPA.dto.response;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class NotificationResponseDTO {

    private Long id;
    private String title;
    private String message;
    private String type;
    private boolean read;
    private LocalDateTime createdAt;
    private Long relatedEntityId;
    private Long userId;
    private String userName;
}
