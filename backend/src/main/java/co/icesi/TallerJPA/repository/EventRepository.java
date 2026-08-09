package co.icesi.TallerJPA.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import co.icesi.TallerJPA.model.Event;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByDateTimeAfterOrderByDateTimeAsc(LocalDateTime dateTime);
    List<Event> findBySpacesId(Long spaceId);
}
