package co.icesi.TallerJPA.dto.response;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class RecommendationResponseDTO {

    private Long id;
    private Long trainerId;
    private String trainerName;
    private Long targetUserId;
    private String targetUserName;
    private String title;
    private String message;
    private LocalDateTime createdAt;
    private boolean read;
    private Long relatedProgressId;
    private Long relatedRoutineId;
}
