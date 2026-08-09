package co.icesi.TallerJPA.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NotificationRequestDTO {

    private String title;

    @NotBlank
    private String message;

    private String type;

    private Long relatedEntityId;

    @NotNull
    private Long userId;
}
