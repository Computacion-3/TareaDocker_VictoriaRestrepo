package co.icesi.TallerJPA.services;

import co.icesi.TallerJPA.dto.request.RoutineExerciseRequestDTO;
import co.icesi.TallerJPA.exception.ResourceNotFoundException;
import co.icesi.TallerJPA.model.Exercise;
import co.icesi.TallerJPA.model.Routine;
import co.icesi.TallerJPA.model.RoutineExercise;
import co.icesi.TallerJPA.model.User;
import co.icesi.TallerJPA.repository.ExerciseRepository;
import co.icesi.TallerJPA.repository.RoutineExerciseRepository;
import co.icesi.TallerJPA.repository.RoutineRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class RoutineExerciseService {

    private final RoutineExerciseRepository routineExerciseRepository;
    private final RoutineRepository routineRepository;
    private final ExerciseRepository exerciseRepository;
    private final AuthContextService authContextService;

    public RoutineExerciseService(
            RoutineExerciseRepository routineExerciseRepository,
            RoutineRepository routineRepository,
            ExerciseRepository exerciseRepository,
            AuthContextService authContextService
    ) {
        this.routineExerciseRepository = routineExerciseRepository;
        this.routineRepository = routineRepository;
        this.exerciseRepository = exerciseRepository;
        this.authContextService = authContextService;
    }

    public List<RoutineExercise> findAll() {
        authContextService.requireAdmin();
        return routineExerciseRepository.findAll();
    }

    public RoutineExercise findById(Long id) {
        RoutineExercise routineExercise = routineExerciseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Routine exercise not found"));
        ensureCanAccessRoutine(routineExercise.getRoutine());
        return routineExercise;
    }

    public RoutineExercise create(Long routineId, RoutineExerciseRequestDTO dto) {
        Routine routine = routineRepository.findById(routineId)
                .orElseThrow(() -> new ResourceNotFoundException("Routine not found"));
        ensureCanManageRoutine(routine);

        RoutineExercise routineExercise = new RoutineExercise();
        routineExercise.setRoutine(routine);
        applyDto(routineExercise, dto);
        return routineExerciseRepository.save(routineExercise);
    }

    public RoutineExercise update(Long id, RoutineExerciseRequestDTO dto) {
        RoutineExercise routineExercise = findById(id);
        ensureCanManageRoutine(routineExercise.getRoutine());
        applyDto(routineExercise, dto);
        return routineExerciseRepository.save(routineExercise);
    }

    public void delete(Long id) {
        RoutineExercise routineExercise = findById(id);
        ensureCanManageRoutine(routineExercise.getRoutine());
        routineExerciseRepository.delete(routineExercise);
    }

    private void applyDto(RoutineExercise routineExercise, RoutineExerciseRequestDTO dto) {
        Exercise exercise = exerciseRepository.findById(dto.getExerciseId())
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found"));
        ensureCanUseExerciseInRoutine(exercise, routineExercise.getRoutine());
        routineExercise.setExercise(exercise);
        routineExercise.setSets(dto.getSets());
        routineExercise.setRepetitions(dto.getRepetitions());
        routineExercise.setDuration(dto.getDuration());
        routineExercise.setOrderIndex(dto.getOrderIndex());
        routineExercise.setNotes(dto.getNotes());
    }

    private void ensureCanAccessRoutine(Routine routine) {
        if (routine.getOwner() != null) {
            authContextService.requireSelfTrainerAssignedOrAdmin(routine.getOwner().getId());
        }
    }

    private void ensureCanManageRoutine(Routine routine) {
        if (authContextService.isAdmin(authContextService.currentUser())) {
            return;
        }
        if (routine.getOwner() != null && routine.getOwner().getId().equals(authContextService.currentUser().getId())) {
            return;
        }
        throw new org.springframework.security.access.AccessDeniedException("You cannot manage this routine exercise");
    }

    private void ensureCanUseExerciseInRoutine(Exercise exercise, Routine routine) {
        User current = authContextService.currentUser();
        if (authContextService.isAdmin(current) || !exercise.isCustom()) {
            return;
        }
        if (exercise.getCreatedBy() != null && exercise.getCreatedBy().getId().equals(current.getId())) {
            return;
        }
        if (routine.getOwner() != null
                && exercise.getCreatedBy() != null
                && exercise.getCreatedBy().getId().equals(routine.getOwner().getId())) {
            return;
        }
        throw new org.springframework.security.access.AccessDeniedException("You cannot use another user's custom exercise");
    }
}
