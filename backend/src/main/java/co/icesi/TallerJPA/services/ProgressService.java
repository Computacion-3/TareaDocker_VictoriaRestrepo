package co.icesi.TallerJPA.services;

import co.icesi.TallerJPA.dto.request.ProgressRequestDTO;
import co.icesi.TallerJPA.exception.ResourceNotFoundException;
import co.icesi.TallerJPA.model.Exercise;
import co.icesi.TallerJPA.model.Progress;
import co.icesi.TallerJPA.model.Routine;
import co.icesi.TallerJPA.model.User;
import co.icesi.TallerJPA.repository.ExerciseRepository;
import co.icesi.TallerJPA.repository.ProgressRepository;
import co.icesi.TallerJPA.repository.RoutineExerciseRepository;
import co.icesi.TallerJPA.repository.RoutineRepository;
import co.icesi.TallerJPA.repository.UserRepository;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProgressService {

    private final ProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final RoutineRepository routineRepository;
    private final RoutineExerciseRepository routineExerciseRepository;
    private final ExerciseRepository exerciseRepository;
    private final AuthContextService authContextService;

    public ProgressService(
            ProgressRepository progressRepository,
            UserRepository userRepository,
            RoutineRepository routineRepository,
            RoutineExerciseRepository routineExerciseRepository,
            ExerciseRepository exerciseRepository,
            AuthContextService authContextService
    ) {
        this.progressRepository = progressRepository;
        this.userRepository = userRepository;
        this.routineRepository = routineRepository;
        this.routineExerciseRepository = routineExerciseRepository;
        this.exerciseRepository = exerciseRepository;
        this.authContextService = authContextService;
    }

    public List<Progress> findAll() {
        return progressRepository.findAll();
    }

    public Progress findById(Long id) {
        return progressRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Progress not found"));
    }

    public Progress findByIdForCurrent(Long id) {
        Progress progress = findById(id);
        authContextService.requireSelfTrainerAssignedOrAdmin(progress.getUser().getId());
        return progress;
    }

    public Progress save(ProgressRequestDTO dto) {

        authContextService.requireAdmin();

        User user = resolveUser(dto.getUserId(), authContextService.currentUser());

        Progress progress = new Progress();

        applyDto(progress, dto, user);

        return progressRepository.save(progress);
    }

    public Progress saveForCurrentUser(ProgressRequestDTO dto) {
        User current = authContextService.currentUser();
        Progress progress = new Progress();
        applyDto(progress, dto, current);
        return progressRepository.save(progress);
    }

    public Progress saveForAssignedUser(Long userId, ProgressRequestDTO dto) {
        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        authContextService.requireTrainerAssignedToUser(userId);

        Progress progress = new Progress();
        applyDto(progress, dto, targetUser);

        return progressRepository.save(progress);
    }

    public Progress update(Long id, ProgressRequestDTO dto) {

        Progress progress = findById(id);
        User current = authContextService.currentUser();

        User user = progress.getUser();
        if (authContextService.isAdmin(current)) {
            user = resolveUser(dto.getUserId(), progress.getUser());
        } else {
            authContextService.requireSelfOrAdmin(progress.getUser().getId());
        }

        applyDto(progress, dto, user);

        return progressRepository.save(progress);
    }

    public void delete(Long id) {

        Progress progress = findById(id);
        authContextService.requireSelfOrAdmin(progress.getUser().getId());

        progressRepository.delete(progress);
    }

    public List<Progress> findMine() {
        return progressRepository.findByUserId(authContextService.currentUser().getId());
    }

    public List<Progress> findMyHistory() {
        return progressRepository.findByUserIdOrderByDateDesc(authContextService.currentUser().getId());
    }

    public List<Progress> findByUserForCurrent(Long userId) {
        authContextService.requireSelfTrainerAssignedOrAdmin(userId);
        return progressRepository.findByUserIdOrderByDateDesc(userId);
    }

    public List<Progress> findMineByRoutine(Long routineId) {
        return progressRepository.findByUserIdAndRoutineId(authContextService.currentUser().getId(), routineId);
    }

    public List<Progress> findMineByExercise(Long exerciseId) {
        return progressRepository.findByUserIdAndExerciseId(authContextService.currentUser().getId(), exerciseId);
    }

    private void applyDto(Progress progress, ProgressRequestDTO dto, User user) {
        progress.setDate(dto.getDate());
        progress.setPeriodType(dto.getPeriodType());
        progress.setRepetitions(dto.getRepetitions());
        progress.setTimeMinutes(dto.getTimeMinutes());
        progress.setEffortLevel(dto.getEffortLevel());
        progress.setWeight(dto.getWeight());
        progress.setNotes(dto.getNotes());
        progress.setUser(user);

        Routine routine = resolveRoutine(dto.getRoutineId(), user);
        progress.setRoutine(routine);

        Exercise exercise = resolveExercise(dto.getExerciseId(), user, routine);
        progress.setExercise(exercise);
    }

    private Routine resolveRoutine(Long routineId, User user) {
        if (routineId == null) {
            return null;
        }

        Routine routine = routineRepository.findById(routineId)
                .orElseThrow(() -> new ResourceNotFoundException("Routine not found"));

        if (routine.isPredefined()) {
            return routine;
        }
        if (routine.getOwner() != null && routine.getOwner().getId().equals(user.getId())) {
            return routine;
        }

        throw new AccessDeniedException("You cannot register progress with another user's routine");
    }

    private Exercise resolveExercise(Long exerciseId, User user, Routine routine) {
        if (exerciseId == null) {
            return null;
        }

        Exercise exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found"));

        if (!exercise.isCustom()) {
            return exercise;
        }
        if (exercise.getCreatedBy() != null && exercise.getCreatedBy().getId().equals(user.getId())) {
            return exercise;
        }
        if (routine != null && routineExerciseRepository.existsByRoutineIdAndExerciseId(routine.getId(), exercise.getId())) {
            return exercise;
        }

        throw new AccessDeniedException("You cannot register progress with another user's custom exercise");
    }

    private User resolveUser(Long userId, User fallback) {
        if (userId == null) {
            return fallback;
        }
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
