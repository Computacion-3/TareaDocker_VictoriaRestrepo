package co.icesi.TallerJPA.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NotificationRequestDTO {

    private String title;

    @NotBlank
    private String message;

    private String type;

    @NotNull
    private Long userId;
}
