package co.icesi.TallerJPA.services;

import co.icesi.TallerJPA.dto.request.TrainerAssignmentRequestDTO;
import co.icesi.TallerJPA.exception.BadRequestException;
import co.icesi.TallerJPA.exception.DuplicateResourceException;
import co.icesi.TallerJPA.exception.ResourceNotFoundException;
import co.icesi.TallerJPA.model.TrainerAssignment;
import co.icesi.TallerJPA.model.User;
import co.icesi.TallerJPA.repository.TrainerAssignmentRepository;
import co.icesi.TallerJPA.repository.UserRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class TrainerAssignmentService {

    private final TrainerAssignmentRepository trainerAssignmentRepository;
    private final UserRepository userRepository;
    private final AuthContextService authContextService;

    public TrainerAssignmentService(
            TrainerAssignmentRepository trainerAssignmentRepository,
            UserRepository userRepository,
            AuthContextService authContextService
    ) {
        this.trainerAssignmentRepository = trainerAssignmentRepository;
        this.userRepository = userRepository;
        this.authContextService = authContextService;
    }

    public List<TrainerAssignment> findAll() {
        authContextService.requireAdmin();
        return trainerAssignmentRepository.findAll();
    }

    public TrainerAssignment findById(Long id) {
        TrainerAssignment assignment = trainerAssignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer assignment not found"));
        User current = authContextService.currentUser();
        if (!authContextService.isAdmin(current) && !assignment.getTrainer().getId().equals(current.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("You cannot access this assignment");
        }
        return assignment;
    }

    public TrainerAssignment create(TrainerAssignmentRequestDTO dto) {
        authContextService.requireAdmin();
        return assign(dto.getTrainerId(), dto.getAssignedUserId());
    }

    public TrainerAssignment assign(Long trainerId, Long userId) {
        authContextService.requireAdmin();
        User trainer = userRepository.findById(trainerId)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found"));
        User assignedUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Assigned user not found"));

        validateRoles(trainer, assignedUser);

        if (trainerAssignmentRepository.existsByTrainerIdAndAssignedUserIdAndActiveTrue(trainerId, userId)) {
            throw new DuplicateResourceException("Active assignment already exists");
        }

        TrainerAssignment assignment = new TrainerAssignment();
        assignment.setTrainer(trainer);
        assignment.setAssignedUser(assignedUser);
        assignment.setActive(true);
        return trainerAssignmentRepository.save(assignment);
    }

    public TrainerAssignment update(Long id, TrainerAssignmentRequestDTO dto) {
        authContextService.requireAdmin();
        TrainerAssignment assignment = trainerAssignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer assignment not found"));

        User trainer = userRepository.findById(dto.getTrainerId())
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found"));
        User assignedUser = userRepository.findById(dto.getAssignedUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Assigned user not found"));

        validateRoles(trainer, assignedUser);

        assignment.setTrainer(trainer);
        assignment.setAssignedUser(assignedUser);
        assignment.setActive(dto.isActive());
        return trainerAssignmentRepository.save(assignment);
    }

    public void delete(Long id) {
        authContextService.requireAdmin();
        TrainerAssignment assignment = trainerAssignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer assignment not found"));
        assignment.setActive(false);
        trainerAssignmentRepository.save(assignment);
    }

    public void unassign(Long trainerId, Long userId) {
        authContextService.requireAdmin();
        TrainerAssignment assignment = trainerAssignmentRepository
                .findByTrainerIdAndAssignedUserIdAndActiveTrue(trainerId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Active assignment not found"));
        assignment.setActive(false);
        trainerAssignmentRepository.save(assignment);
    }

    public List<TrainerAssignment> findMyAssignments() {
        User current = authContextService.currentUser();
        authContextService.requireTrainer();
        return trainerAssignmentRepository.findByTrainerIdAndActiveTrue(current.getId());
    }

    public List<TrainerAssignment> findByTrainerId(Long trainerId) {
        User current = authContextService.currentUser();
        if (!authContextService.isAdmin(current) && !current.getId().equals(trainerId)) {
            throw new org.springframework.security.access.AccessDeniedException("You cannot access another trainer assignments");
        }
        return trainerAssignmentRepository.findByTrainerIdAndActiveTrue(trainerId);
    }

    public boolean isAssigned(Long trainerId, Long userId) {
        return trainerAssignmentRepository.existsByTrainerIdAndAssignedUserIdAndActiveTrue(trainerId, userId);
    }

    private void validateRoles(User trainer, User assignedUser) {
        if (!authContextService.isTrainer(trainer)) {
            throw new BadRequestException("trainerId must belong to a TRAINER user");
        }
        if (!authContextService.isUser(assignedUser)) {
            throw new BadRequestException("assignedUserId must belong to a USER user");
        }
    }
}
