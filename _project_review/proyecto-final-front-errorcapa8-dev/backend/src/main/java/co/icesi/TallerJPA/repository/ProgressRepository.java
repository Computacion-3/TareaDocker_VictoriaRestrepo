package co.icesi.TallerJPA.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import co.icesi.TallerJPA.model.Progress;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long>{
    List<Progress> findByUserId(Long userId);
    List<Progress> findByUserIdOrderByDateDesc(Long userId);
    List<Progress> findByUserIdAndRoutineId(Long userId, Long routineId);
    List<Progress> findByUserIdAndExerciseId(Long userId, Long exerciseId);
    List<Progress> findByUserIdAndDateBetweenOrderByDateAsc(Long userId, LocalDate startDate, LocalDate endDate);
}
