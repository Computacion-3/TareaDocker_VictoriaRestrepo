package co.icesi.TallerJPA.dto.response;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class TrainerAssignmentResponseDTO {

    private Long id;
    private Long trainerId;
    private String trainerName;
    private Long assignedUserId;
    private String assignedUserName;
    private LocalDateTime assignedAt;
    private boolean active;
}
