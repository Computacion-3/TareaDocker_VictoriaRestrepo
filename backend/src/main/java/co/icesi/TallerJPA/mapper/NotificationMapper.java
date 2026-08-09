package co.icesi.TallerJPA.mapper;

import org.springframework.stereotype.Component;

import co.icesi.TallerJPA.dto.response.NotificationResponseDTO;
import co.icesi.TallerJPA.model.Notification;

@Component
public class NotificationMapper {

    public NotificationResponseDTO toResponseDTO(Notification notification) {

        NotificationResponseDTO dto = new NotificationResponseDTO();

        dto.setId(notification.getId());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setType(notification.getType());
        dto.setRead(notification.isRead());
        dto.setCreatedAt(notification.getCreatedAt());
        dto.setRelatedEntityId(notification.getRelatedEntityId());

        if (notification.getUser() != null) {
            dto.setUserId(notification.getUser().getId());
            dto.setUserName(notification.getUser().getName());
        }

        return dto;
    }
}
