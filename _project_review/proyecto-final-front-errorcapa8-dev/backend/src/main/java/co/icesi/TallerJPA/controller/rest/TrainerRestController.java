package co.icesi.TallerJPA.controller.rest;

import co.icesi.TallerJPA.dto.request.ProgressRequestDTO;
import co.icesi.TallerJPA.dto.request.TrainerRoutineAssignmentRequestDTO;
import co.icesi.TallerJPA.dto.response.ProgressResponseDTO;
import co.icesi.TallerJPA.dto.response.RecommendationResponseDTO;
import co.icesi.TallerJPA.dto.response.RoutineResponseDTO;
import co.icesi.TallerJPA.dto.response.UserResponseDTO;
import co.icesi.TallerJPA.mapper.ProgressMapper;
import co.icesi.TallerJPA.mapper.RecommendationMapper;
import co.icesi.TallerJPA.mapper.RoutineMapper;
import co.icesi.TallerJPA.mapper.UserMapper;
import co.icesi.TallerJPA.services.AuthContextService;
import co.icesi.TallerJPA.services.ProgressService;
import co.icesi.TallerJPA.services.RecommendationService;
import co.icesi.TallerJPA.services.RoutineService;
import co.icesi.TallerJPA.services.TrainerAssignmentService;
import co.icesi.TallerJPA.services.UserService;
import java.util.List;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/trainers")
public class TrainerRestController {

    private final UserService userService;
    private final UserMapper userMapper;
    private final TrainerAssignmentService trainerAssignmentService;
    private final RoutineService routineService;
    private final RoutineMapper routineMapper;
    private final ProgressService progressService;
    private final ProgressMapper progressMapper;
    private final RecommendationService recommendationService;
    private final RecommendationMapper recommendationMapper;
    private final AuthContextService authContextService;

    public TrainerRestController(
            UserService userService,
            UserMapper userMapper,
            TrainerAssignmentService trainerAssignmentService,
            RoutineService routineService,
            RoutineMapper routineMapper,
            ProgressService progressService,
            ProgressMapper progressMapper,
            RecommendationService recommendationService,
            RecommendationMapper recommendationMapper,
            AuthContextService authContextService
    ) {
        this.userService = userService;
        this.userMapper = userMapper;
        this.trainerAssignmentService = trainerAssignmentService;
        this.routineService = routineService;
        this.routineMapper = routineMapper;
        this.progressService = progressService;
        this.progressMapper = progressMapper;
        this.recommendationService = recommendationService;
        this.recommendationMapper = recommendationMapper;
        this.authContextService = authContextService;
    }

    @GetMapping
    public List<UserResponseDTO> getTrainers() {
        authContextService.requireAdmin();
        return userService.getAllTrainers().stream().map(userMapper::entityToDto).toList();
    }

    @GetMapping("/me/users")
    public List<UserResponseDTO> getMyUsers() {
        return trainerAssignmentService.findMyAssignments()
                .stream()
                .map(assignment -> userMapper.entityToDto(assignment.getAssignedUser()))
                .toList();
    }

    @GetMapping("/{trainerId}/users")
    public List<UserResponseDTO> getTrainerUsers(@PathVariable Long trainerId) {
        return trainerAssignmentService.findByTrainerId(trainerId)
                .stream()
                .map(assignment -> userMapper.entityToDto(assignment.getAssignedUser()))
                .toList();
    }

    @PostMapping("/{trainerId}/assign/{userId}")
    public void assign(@PathVariable Long trainerId, @PathVariable Long userId) {
        trainerAssignmentService.assign(trainerId, userId);
    }

    @DeleteMapping("/{trainerId}/unassign/{userId}")
    public void unassign(@PathVariable Long trainerId, @PathVariable Long userId) {
        trainerAssignmentService.unassign(trainerId, userId);
    }

    @GetMapping("/me/users/{userId}/routines")
    public List<RoutineResponseDTO> getAssignedUserRoutines(@PathVariable Long userId) {
        authContextService.requireTrainerAssignedToUser(userId);
        return routineService.findByOwnerId(userId).stream().map(routineMapper::toResponseDTO).toList();
    }

    @PostMapping("/me/users/{userId}/routines")
    public RoutineResponseDTO assignRoutineToUser(
            @PathVariable Long userId,
            @RequestBody TrainerRoutineAssignmentRequestDTO dto
    ) {
        return routineMapper.toResponseDTO(routineService.assignRoutineToAssignedUser(userId, dto));
    }

    @GetMapping("/me/users/{userId}/progress")
    public List<ProgressResponseDTO> getAssignedUserProgress(@PathVariable Long userId) {
        return progressService.findByUserForCurrent(userId).stream().map(progressMapper::toResponseDTO).toList();
    }

    @PostMapping("/me/users/{userId}/progress")
    public ProgressResponseDTO createAssignedUserProgress(
            @PathVariable Long userId,
            @Valid @RequestBody ProgressRequestDTO dto
    ) {
        return progressMapper.toResponseDTO(progressService.saveForAssignedUser(userId, dto));
    }

    @GetMapping("/me/users/{userId}/recommendations")
    public List<RecommendationResponseDTO> getAssignedUserRecommendations(@PathVariable Long userId) {
        return recommendationService.findByUserForCurrent(userId)
                .stream()
                .map(recommendationMapper::toResponseDTO)
                .toList();
    }
}
