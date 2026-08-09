package co.icesi.TallerJPA.services;

import co.icesi.TallerJPA.dto.request.ExerciseRequestDTO;
import co.icesi.TallerJPA.exception.ResourceNotFoundException;
import co.icesi.TallerJPA.model.Exercise;
import co.icesi.TallerJPA.model.User;
import co.icesi.TallerJPA.repository.ExerciseRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final AuthContextService authContextService;

    public ExerciseService(ExerciseRepository exerciseRepository, AuthContextService authContextService) {
        this.exerciseRepository = exerciseRepository;
        this.authContextService = authContextService;
    }

    public List<Exercise> findAll() {
        User current = authContextService.currentUser();
        if (authContextService.isAdmin(current)) {
            return exerciseRepository.findAll();
        }
        return exerciseRepository.findByCustomFalseOrCreatedById(current.getId());
    }

    public List<Exercise> findAvailableForCurrent() {
        User current = authContextService.currentUser();
        return authContextService.isAdmin(current)
                ? exerciseRepository.findAll()
                : exerciseRepository.findByCustomFalseOrCreatedById(current.getId());
    }

    public List<Exercise> findCustomMine() {
        return exerciseRepository.findByCreatedById(authContextService.currentUser().getId());
    }

    public Exercise findById(Long id) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Exercise not found"));
        ensureCanView(exercise);
        return exercise;
    }

    public Exercise save(ExerciseRequestDTO dto) {
        authContextService.requireAdmin();

        Exercise exercise = new Exercise();

        applyDto(exercise, dto);
        exercise.setCustom(false);
        exercise.setCreatedBy(null);

        return exerciseRepository.save(exercise);
    }

    public Exercise saveCustom(ExerciseRequestDTO dto) {
        Exercise exercise = new Exercise();

        applyDto(exercise, dto);
        exercise.setCustom(true);
        exercise.setCreatedBy(authContextService.currentUser());

        return exerciseRepository.save(exercise);
    }

    public Exercise update(Long id, ExerciseRequestDTO dto) {

        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found"));

        ensureCanManage(exercise);
        applyDto(exercise, dto);

        return exerciseRepository.save(exercise);
    }

    public void delete(Long id) {

        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found"));

        ensureCanManage(exercise);

        exerciseRepository.delete(exercise);
    }

    public boolean canUseExercise(User user, Exercise exercise) {
        return !exercise.isCustom()
                || authContextService.isAdmin(user)
                || (exercise.getCreatedBy() != null && exercise.getCreatedBy().getId().equals(user.getId()));
    }

    private void applyDto(Exercise exercise, ExerciseRequestDTO dto) {
        exercise.setName(dto.getName());
        exercise.setType(dto.getType());
        exercise.setDescription(dto.getDescription());
        exercise.setDuration(dto.getDuration());
        exercise.setDifficulty(dto.getDifficulty());
        exercise.setVideoUrl(dto.getVideoUrl());
    }

    private void ensureCanView(Exercise exercise) {
        User current = authContextService.currentUser();
        if (!canUseExercise(current, exercise)) {
            throw new AccessDeniedException("You cannot access this custom exercise");
        }
    }

    private void ensureCanManage(Exercise exercise) {
        User current = authContextService.currentUser();
        if (authContextService.isAdmin(current)) {
            return;
        }
        if (exercise.isCustom()
                && exercise.getCreatedBy() != null
                && exercise.getCreatedBy().getId().equals(current.getId())) {
            return;
        }
        throw new AccessDeniedException("You cannot manage this exercise");
    }
}
