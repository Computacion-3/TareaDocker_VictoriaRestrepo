package co.icesi.TallerJPA.repository;

import co.icesi.TallerJPA.model.RoutineExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoutineExerciseRepository extends JpaRepository<RoutineExercise, Long> {
    boolean existsByRoutineIdAndExerciseId(Long routineId, Long exerciseId);
}
