package co.icesi.TallerJPA.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import co.icesi.TallerJPA.model.Routine;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoutineRepository extends JpaRepository<Routine, Long> {
    List<Routine> findByOwnerId(Long ownerId);
    List<Routine> findByCreatedById(Long createdById);
    List<Routine> findByPredefinedTrue();
    Optional<Routine> findByOwnerIdAndId(Long ownerId, Long id);
}
