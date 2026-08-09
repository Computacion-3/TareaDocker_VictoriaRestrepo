package co.icesi.TallerJPA.services;

import co.icesi.TallerJPA.dto.request.NotificationRequestDTO;
import co.icesi.TallerJPA.exception.ResourceNotFoundException;
import co.icesi.TallerJPA.model.Notification;
import co.icesi.TallerJPA.model.User;
import co.icesi.TallerJPA.repository.NotificationRepository;
import co.icesi.TallerJPA.repository.UserRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final AuthContextService authContextService;

    public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository,
            AuthContextService authContextService
    ) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.authContextService = authContextService;
    }

    public List<Notification> findAll() {
        authContextService.requireAdmin();
        return notificationRepository.findAll();
    }

    public Notification findById(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        authContextService.requireSelfOrAdmin(notification.getUser().getId());
        return notification;
    }

    public List<Notification> findMine() {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(authContextService.currentUser().getId());
    }

    public Notification save(NotificationRequestDTO dto) {
        authContextService.requireAdmin();
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Notification notification = new Notification();
        applyDto(notification, dto, user);

        return notificationRepository.save(notification);
    }

    public Notification update(Long id, NotificationRequestDTO dto) {
        authContextService.requireAdmin();
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        applyDto(notification, dto, user);

        return notificationRepository.save(notification);
    }

    public Notification markAsRead(Long id) {
        Notification notification = findById(id);
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    public void delete(Long id) {
        Notification notification = findById(id);
        notificationRepository.delete(notification);
    }

    private void applyDto(Notification notification, NotificationRequestDTO dto, User user) {
        notification.setTitle(dto.getTitle());
        notification.setMessage(dto.getMessage());
        notification.setType(dto.getType());
        notification.setRelatedEntityId(dto.getRelatedEntityId());
        notification.setUser(user);
    }
}
