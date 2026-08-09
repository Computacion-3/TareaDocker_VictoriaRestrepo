package co.icesi.TallerJPA.dto;

import lombok.Data;

@Data
public class NotificationResponseDTO {

    private Long id;
    private String title;
    private String message;
    private String type;
    private Long userId;
}
