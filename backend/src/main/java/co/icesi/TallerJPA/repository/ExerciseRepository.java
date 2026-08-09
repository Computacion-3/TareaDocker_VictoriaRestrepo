package co.icesi.TallerJPA.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import co.icesi.TallerJPA.model.Exercise;
import java.util.List;


@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long>{
    List<Exercise> findByCustomFalse();
    List<Exercise> findByCreatedById(Long createdById);
    List<Exercise> findByCustomFalseOrCreatedById(Long createdById);
}
