package co.icesi.TallerJPA.repository;

import co.icesi.TallerJPA.model.TrainerAssignment;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainerAssignmentRepository extends JpaRepository<TrainerAssignment, Long> {
    List<TrainerAssignment> findByTrainerIdAndActiveTrue(Long trainerId);
    List<TrainerAssignment> findByAssignedUserIdAndActiveTrue(Long assignedUserId);
    boolean existsByTrainerIdAndAssignedUserIdAndActiveTrue(Long trainerId, Long assignedUserId);
    Optional<TrainerAssignment> findByTrainerIdAndAssignedUserIdAndActiveTrue(Long trainerId, Long assignedUserId);
}
