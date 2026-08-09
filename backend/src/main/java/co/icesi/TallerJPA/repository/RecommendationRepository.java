package co.icesi.TallerJPA.repository;

import co.icesi.TallerJPA.model.Recommendation;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    List<Recommendation> findByTargetUserId(Long targetUserId);
    List<Recommendation> findByTrainerId(Long trainerId);
    List<Recommendation> findByTrainerIdAndTargetUserId(Long trainerId, Long targetUserId);
}
