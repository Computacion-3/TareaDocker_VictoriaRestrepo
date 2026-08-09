package co.icesi.TallerJPA.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import co.icesi.TallerJPA.model.Notification;
import java.util.List;


@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long>{
    List<Notification> findByUserId(Long userId);
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
}
