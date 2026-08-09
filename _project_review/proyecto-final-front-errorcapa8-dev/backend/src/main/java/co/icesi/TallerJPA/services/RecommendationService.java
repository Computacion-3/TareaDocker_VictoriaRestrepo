package co.icesi.TallerJPA.services;

import co.icesi.TallerJPA.dto.request.RecommendationRequestDTO;
import co.icesi.TallerJPA.exception.ResourceNotFoundException;
import co.icesi.TallerJPA.model.Progress;
import co.icesi.TallerJPA.model.Recommendation;
import co.icesi.TallerJPA.model.Routine;
import co.icesi.TallerJPA.model.User;
import co.icesi.TallerJPA.repository.ProgressRepository;
import co.icesi.TallerJPA.repository.RecommendationRepository;
import co.icesi.TallerJPA.repository.RoutineRepository;
import co.icesi.TallerJPA.repository.UserRepository;
import java.util.List;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;
    private final UserRepository userRepository;
    private final ProgressRepository progressRepository;
    private final RoutineRepository routineRepository;
    private final AuthContextService authContextService;

    public RecommendationService(
            RecommendationRepository recommendationRepository,
            UserRepository userRepository,
            ProgressRepository progressRepository,
            RoutineRepository routineRepository,
            AuthContextService authContextService
    ) {
        this.recommendationRepository = recommendationRepository;
        this.userRepository = userRepository;
        this.progressRepository = progressRepository;
        this.routineRepository = routineRepository;
        this.authContextService = authContextService;
    }

    public List<Recommendation> findAll() {
        authContextService.requireAdmin();
        return recommendationRepository.findAll();
    }

    public Recommendation findById(Long id) {
        Recommendation recommendation = recommendationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recommendation not found"));
        authContextService.requireSelfTrainerAssignedOrAdmin(recommendation.getTargetUser().getId());
        return recommendation;
    }

    public List<Recommendation> findMine() {
        return recommendationRepository.findByTargetUserId(authContextService.currentUser().getId());
    }

    public List<Recommendation> findByUserForCurrent(Long userId) {
        authContextService.requireSelfTrainerAssignedOrAdmin(userId);
        return recommendationRepository.findByTargetUserId(userId);
    }

    public Recommendation createForUser(Long userId, RecommendationRequestDTO dto) {
        User trainer = authContextService.currentUser();
        authContextService.requireTrainer();
        authContextService.requireTrainerAssignedToUser(userId);

        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Target user not found"));

        Recommendation recommendation = new Recommendation();
        recommendation.setTrainer(trainer);
        recommendation.setTargetUser(targetUser);
        applyDto(recommendation, dto, targetUser);

        return recommendationRepository.save(recommendation);
    }

    public Recommendation update(Long id, RecommendationRequestDTO dto) {
        Recommendation recommendation = findById(id);
        User current = authContextService.currentUser();
        if (!authContextService.isAdmin(current) && !recommendation.getTrainer().getId().equals(current.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("You cannot update this recommendation");
        }
        applyDto(recommendation, dto, recommendation.getTargetUser());
        return recommendationRepository.save(recommendation);
    }

    public Recommendation markAsRead(Long id) {
        Recommendation recommendation = findById(id);
        User current = authContextService.currentUser();
        if (!authContextService.isAdmin(current) && !recommendation.getTargetUser().getId().equals(current.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("Only the target user can mark as read");
        }
        recommendation.setRead(true);
        return recommendationRepository.save(recommendation);
    }

    public void delete(Long id) {
        Recommendation recommendation = findById(id);
        User current = authContextService.currentUser();
        if (!authContextService.isAdmin(current) && !recommendation.getTrainer().getId().equals(current.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("You cannot delete this recommendation");
        }
        recommendationRepository.delete(recommendation);
    }

    private void applyDto(Recommendation recommendation, RecommendationRequestDTO dto, User targetUser) {
        recommendation.setTitle(dto.getTitle());
        recommendation.setMessage(dto.getMessage());

        Progress relatedProgress = null;
        if (dto.getRelatedProgressId() != null) {
            relatedProgress = progressRepository.findById(dto.getRelatedProgressId())
                    .orElseThrow(() -> new ResourceNotFoundException("Related progress not found"));
            if (relatedProgress.getUser() == null || !relatedProgress.getUser().getId().equals(targetUser.getId())) {
                throw new AccessDeniedException("Related progress must belong to the recommendation target user");
            }
        }
        recommendation.setRelatedProgress(relatedProgress);

        Routine relatedRoutine = null;
        if (dto.getRelatedRoutineId() != null) {
            relatedRoutine = routineRepository.findById(dto.getRelatedRoutineId())
                    .orElseThrow(() -> new ResourceNotFoundException("Related routine not found"));
            boolean belongsToTarget = relatedRoutine.getOwner() != null
                    && relatedRoutine.getOwner().getId().equals(targetUser.getId());
            if (!belongsToTarget && !relatedRoutine.isPredefined()) {
                throw new AccessDeniedException("Related routine must belong to the target user or be a template");
            }
        }
        recommendation.setRelatedRoutine(relatedRoutine);
    }
}
