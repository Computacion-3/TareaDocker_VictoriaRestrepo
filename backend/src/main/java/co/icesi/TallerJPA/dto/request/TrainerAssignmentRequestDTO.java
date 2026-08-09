package co.icesi.TallerJPA.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TrainerAssignmentRequestDTO {

    @NotNull
    private Long trainerId;

    @NotNull
    private Long assignedUserId;

    private boolean active = true;
}
