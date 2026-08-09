package co.icesi.TallerJPA.services;

import co.icesi.TallerJPA.exception.ResourceNotFoundException;
import co.icesi.TallerJPA.model.User;
import co.icesi.TallerJPA.repository.TrainerAssignmentRepository;
import co.icesi.TallerJPA.repository.UserRepository;
import co.icesi.TallerJPA.security.UserDetailCustom;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthContextService {

    private final UserRepository userRepository;
    private final TrainerAssignmentRepository trainerAssignmentRepository;

    public AuthContextService(
            UserRepository userRepository,
            TrainerAssignmentRepository trainerAssignmentRepository
    ) {
        this.userRepository = userRepository;
        this.trainerAssignmentRepository = trainerAssignmentRepository;
    }

    public User currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Authentication required");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetailCustom userDetailCustom) {
            return userDetailCustom.getUser();
        }

        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    public boolean hasRole(User user, String roleName) {
        return user.getRole() != null && roleName.equals(user.getRole().getName());
    }

    public boolean isAdmin(User user) {
        return hasRole(user, "ADMIN");
    }

    public boolean isTrainer(User user) {
        return hasRole(user, "TRAINER");
    }

    public boolean isUser(User user) {
        return hasRole(user, "USER");
    }

    public void requireAdmin() {
        if (!isAdmin(currentUser())) {
            throw new AccessDeniedException("ADMIN role required");
        }
    }

    public void requireTrainer() {
        if (!isTrainer(currentUser())) {
            throw new AccessDeniedException("TRAINER role required");
        }
    }

    public void requireSelfOrAdmin(Long userId) {
        User current = currentUser();
        if (!isAdmin(current) && !current.getId().equals(userId)) {
            throw new AccessDeniedException("You can only access your own data");
        }
    }

    public void requireTrainerAssignedToUser(Long userId) {
        User current = currentUser();
        if (isAdmin(current)) {
            return;
        }
        if (!isTrainer(current)) {
            throw new AccessDeniedException("TRAINER role required");
        }
        if (!trainerAssignmentRepository.existsByTrainerIdAndAssignedUserIdAndActiveTrue(current.getId(), userId)) {
            throw new AccessDeniedException("User is not assigned to this trainer");
        }
    }

    public void requireSelfTrainerAssignedOrAdmin(Long userId) {
        User current = currentUser();
        if (isAdmin(current) || current.getId().equals(userId)) {
            return;
        }
        if (isTrainer(current)
                && trainerAssignmentRepository.existsByTrainerIdAndAssignedUserIdAndActiveTrue(current.getId(), userId)) {
            return;
        }
        throw new AccessDeniedException("You do not have access to this user data");
    }
}
