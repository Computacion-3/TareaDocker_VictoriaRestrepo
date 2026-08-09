package co.icesi.TallerJPA.services;

import co.icesi.TallerJPA.dto.request.RoutineRequestDTO;
import co.icesi.TallerJPA.dto.request.RoutineExerciseRequestDTO;
import co.icesi.TallerJPA.dto.request.TrainerRoutineAssignmentRequestDTO;
import co.icesi.TallerJPA.exception.BadRequestException;
import co.icesi.TallerJPA.exception.ResourceNotFoundException;
import co.icesi.TallerJPA.model.Exercise;
import co.icesi.TallerJPA.model.Routine;
import co.icesi.TallerJPA.model.RoutineExercise;
import co.icesi.TallerJPA.model.User;
import co.icesi.TallerJPA.repository.ExerciseRepository;
import co.icesi.TallerJPA.repository.RoutineRepository;
import co.icesi.TallerJPA.repository.UserRepository;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RoutineService {

    private final RoutineRepository routineRepository;
    private final UserRepository userRepository;
    private final ExerciseRepository exerciseRepository;
    private final AuthContextService authContextService;

    public RoutineService(
            RoutineRepository routineRepository,
            UserRepository userRepository,
            ExerciseRepository exerciseRepository,
            AuthContextService authContextService
    ) {
        this.routineRepository = routineRepository;
        this.userRepository = userRepository;
        this.exerciseRepository = exerciseRepository;
        this.authContextService = authContextService;
    }

    public List<Routine> findAll() {
        return routineRepository.findAll();
    }

    public Routine findById(Long id) {

        return routineRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Routine not found"));
    }

    public Routine findByIdForCurrent(Long id) {
        Routine routine = findById(id);
        if (routine.getOwner() != null) {
            authContextService.requireSelfTrainerAssignedOrAdmin(routine.getOwner().getId());
        }
        return routine;
    }

    public Routine save(RoutineRequestDTO dto) {

        authContextService.requireAdmin();

        User current = authContextService.currentUser();

        Routine routine = new Routine();

        routine.setName(dto.getName());
        routine.setDescription(dto.getDescription());
        routine.setOwner(current);
        routine.setCreatedBy(current);
        routine.setPredefined(false);
        routine.setRoutineExercises(buildRoutineExercises(routine, dto));

        return routineRepository.save(routine);
    }

    public Routine saveForCurrentUser(RoutineRequestDTO dto) {
        User current = authContextService.currentUser();
        Routine routine = new Routine();

        routine.setName(dto.getName());
        routine.setDescription(dto.getDescription());
        routine.setOwner(current);
        routine.setCreatedBy(current);
        routine.setPredefined(false);
        routine.setRoutineExercises(buildRoutineExercises(routine, dto));

        return routineRepository.save(routine);
    }

    public Routine createTemplate(RoutineRequestDTO dto) {
        User current = authContextService.currentUser();
        if (!authContextService.isTrainer(current) && !authContextService.isAdmin(current)) {
            throw new org.springframework.security.access.AccessDeniedException("TRAINER or ADMIN role required");
        }

        Routine routine = new Routine();
        routine.setName(dto.getName());
        routine.setDescription(dto.getDescription());
        routine.setOwner(null);
        routine.setCreatedBy(current);
        routine.setPredefined(true);
        routine.setRoutineExercises(buildRoutineExercises(routine, dto));

        return routineRepository.save(routine);
    }

    public Routine adoptTemplate(Long templateId) {
        User current = authContextService.currentUser();
        if (!authContextService.isUser(current)) {
            throw new AccessDeniedException("USER role required to adopt routine templates");
        }

        Routine template = findById(templateId);
        if (!template.isPredefined()) {
            throw new ResourceNotFoundException("Routine template not found");
        }

        Routine adopted = new Routine();
        adopted.setName(template.getName());
        adopted.setDescription(template.getDescription());
        adopted.setOwner(current);
        adopted.setCreatedBy(current);
        adopted.setPredefined(false);

        List<RoutineExercise> copiedExercises = new ArrayList<>();
        List<RoutineExercise> sourceExercises = template.getRoutineExercises() == null
                ? List.of()
                : template.getRoutineExercises();
        for (RoutineExercise source : sourceExercises) {
            RoutineExercise copy = new RoutineExercise();
            copy.setRoutine(adopted);
            copy.setExercise(source.getExercise());
            copy.setSets(source.getSets());
            copy.setRepetitions(source.getRepetitions());
            copy.setDuration(source.getDuration());
            copy.setOrderIndex(source.getOrderIndex());
            copy.setNotes(source.getNotes());
            copiedExercises.add(copy);
        }
        adopted.setRoutineExercises(copiedExercises);

        return routineRepository.save(adopted);
    }

    public Routine assignRoutineToAssignedUser(Long userId, TrainerRoutineAssignmentRequestDTO dto) {
        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        authContextService.requireTrainerAssignedToUser(userId);

        Routine source = resolveRoutineForTrainerAssignment(dto);
        User trainer = authContextService.currentUser();

        Routine assigned = new Routine();
        assigned.setName(resolveAssignedRoutineName(dto, source));
        assigned.setDescription(resolveAssignedRoutineDescription(dto, source));
        assigned.setOwner(targetUser);
        assigned.setCreatedBy(trainer);
        assigned.setPredefined(false);
        assigned.setRoutineExercises(copyRoutineExercises(source, assigned));

        return routineRepository.save(assigned);
    }

    public Routine update(Long id, RoutineRequestDTO dto) {

        Routine routine = findById(id);

        ensureCanManageRoutine(routine);

        routine.setName(dto.getName());
        routine.setDescription(dto.getDescription());
        if (routine.getRoutineExercises() == null) {
            routine.setRoutineExercises(new ArrayList<>());
        }
        routine.getRoutineExercises().clear();
        routine.getRoutineExercises().addAll(buildRoutineExercises(routine, dto));

        return routineRepository.save(routine);
    }

    public void delete(Long id) {

        Routine routine = findById(id);
        ensureCanManageRoutine(routine);

        routineRepository.delete(routine);
    }

    public List<Routine> findMine() {
        return routineRepository.findByOwnerId(authContextService.currentUser().getId());
    }

    public List<Routine> findTemplates() {
        return routineRepository.findByPredefinedTrue();
    }

    public List<Routine> findByOwnerIdForTrainerOrAdmin(Long ownerId) {
        authContextService.requireSelfTrainerAssignedOrAdmin(ownerId);
        return routineRepository.findByOwnerId(ownerId);
    }

    public List<Routine> findByOwnerId(Long ownerId) {
        return routineRepository.findByOwnerId(ownerId);
    }

    private List<RoutineExercise> buildRoutineExercises(Routine routine, RoutineRequestDTO dto) {
        if (dto.getExerciseDetails() != null && !dto.getExerciseDetails().isEmpty()) {
            return buildDetailedRoutineExercises(routine, dto.getExerciseDetails());
        }

        List<Long> ids = dto.getExerciseIds() == null ? List.of() : dto.getExerciseIds();
        List<Exercise> exercises = exerciseRepository.findAllById(ids);

        if (exercises.size() != ids.size()) {
            throw new ResourceNotFoundException("One or more exercises not found");
        }

        List<RoutineExercise> routineExercises = new ArrayList<>();
        for (int i = 0; i < exercises.size(); i++) {
            ensureCanUseExerciseInRoutine(exercises.get(i), routine);
            RoutineExercise routineExercise = new RoutineExercise();
            routineExercise.setRoutine(routine);
            routineExercise.setExercise(exercises.get(i));
            routineExercise.setOrderIndex(i + 1);
            routineExercises.add(routineExercise);
        }
        return routineExercises;
    }

    private List<RoutineExercise> buildDetailedRoutineExercises(
            Routine routine,
            List<RoutineExerciseRequestDTO> exerciseDetails
    ) {
        List<Long> ids = exerciseDetails.stream()
                .map(RoutineExerciseRequestDTO::getExerciseId)
                .toList();
        List<Exercise> exercises = exerciseRepository.findAllById(ids);

        if (exercises.size() != ids.size()) {
            throw new ResourceNotFoundException("One or more exercises not found");
        }

        List<RoutineExercise> routineExercises = new ArrayList<>();
        for (int i = 0; i < exerciseDetails.size(); i++) {
            RoutineExerciseRequestDTO detail = exerciseDetails.get(i);
            Exercise exercise = exercises.stream()
                    .filter(candidate -> candidate.getId().equals(detail.getExerciseId()))
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Exercise not found"));
            ensureCanUseExerciseInRoutine(exercise, routine);

            RoutineExercise routineExercise = new RoutineExercise();
            routineExercise.setRoutine(routine);
            routineExercise.setExercise(exercise);
            routineExercise.setSets(detail.getSets());
            routineExercise.setRepetitions(detail.getRepetitions());
            routineExercise.setDuration(detail.getDuration());
            routineExercise.setOrderIndex(detail.getOrderIndex() != null ? detail.getOrderIndex() : i + 1);
            routineExercise.setNotes(detail.getNotes());
            routineExercises.add(routineExercise);
        }
        return routineExercises;
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
        throw new AccessDeniedException("You cannot use another user's custom exercise");
    }

    private Routine resolveRoutineForTrainerAssignment(TrainerRoutineAssignmentRequestDTO dto) {
        if (dto == null) {
            throw new BadRequestException("Routine selection is required");
        }

        Long sourceId = dto.getTemplateId() != null ? dto.getTemplateId() : dto.getRoutineId();
        if (sourceId == null) {
            throw new BadRequestException("Routine selection is required");
        }

        Routine source = findById(sourceId);
        User trainer = authContextService.currentUser();
        boolean createdByTrainer = source.getCreatedBy() != null
                && source.getCreatedBy().getId().equals(trainer.getId());

        if (source.isPredefined() || createdByTrainer) {
            return source;
        }

        throw new AccessDeniedException("You cannot assign this routine");
    }

    private String resolveAssignedRoutineName(TrainerRoutineAssignmentRequestDTO dto, Routine source) {
        if (dto != null && dto.getName() != null && !dto.getName().isBlank()) {
            return dto.getName().trim();
        }
        return source.getName();
    }

    private String resolveAssignedRoutineDescription(TrainerRoutineAssignmentRequestDTO dto, Routine source) {
        if (dto != null && dto.getDescription() != null && !dto.getDescription().isBlank()) {
            return dto.getDescription().trim();
        }
        return source.getDescription();
    }

    private List<RoutineExercise> copyRoutineExercises(Routine source, Routine target) {
        List<RoutineExercise> sourceExercises = source.getRoutineExercises() == null
                ? List.of()
                : source.getRoutineExercises();
        List<RoutineExercise> copiedExercises = new ArrayList<>();

        for (RoutineExercise sourceExercise : sourceExercises) {
            RoutineExercise copy = new RoutineExercise();
            copy.setRoutine(target);
            copy.setExercise(sourceExercise.getExercise());
            copy.setSets(sourceExercise.getSets());
            copy.setRepetitions(sourceExercise.getRepetitions());
            copy.setDuration(sourceExercise.getDuration());
            copy.setOrderIndex(sourceExercise.getOrderIndex());
            copy.setNotes(sourceExercise.getNotes());
            copiedExercises.add(copy);
        }

        return copiedExercises;
    }

    private void ensureCanManageRoutine(Routine routine) {
        User current = authContextService.currentUser();
        if (authContextService.isAdmin(current)) {
            return;
        }
        if (routine.getOwner() != null && routine.getOwner().getId().equals(current.getId())) {
            return;
        }
        if (routine.isPredefined() && routine.getCreatedBy() != null && routine.getCreatedBy().getId().equals(current.getId())) {
            return;
        }
        throw new AccessDeniedException("You cannot manage this routine");
    }
}
