package co.icesi.TallerJPA.services;

import co.icesi.TallerJPA.dto.response.HistoryEntryDTO;
import co.icesi.TallerJPA.dto.response.HistoryResponseDTO;
import co.icesi.TallerJPA.dto.response.HistorySummaryDTO;
import co.icesi.TallerJPA.exception.ResourceNotFoundException;
import co.icesi.TallerJPA.model.Progress;
import co.icesi.TallerJPA.model.Routine;
import co.icesi.TallerJPA.model.User;
import co.icesi.TallerJPA.repository.ProgressRepository;
import co.icesi.TallerJPA.repository.RoutineRepository;
import co.icesi.TallerJPA.repository.UserRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import org.springframework.stereotype.Service;

@Service
public class HistoryService {

    private final ProgressRepository progressRepository;
    private final RoutineRepository routineRepository;
    private final UserRepository userRepository;
    private final AuthContextService authContextService;

    public HistoryService(
            ProgressRepository progressRepository,
            RoutineRepository routineRepository,
            UserRepository userRepository,
            AuthContextService authContextService
    ) {
        this.progressRepository = progressRepository;
        this.routineRepository = routineRepository;
        this.userRepository = userRepository;
        this.authContextService = authContextService;
    }

    public HistoryResponseDTO findMine() {
        return buildHistory(authContextService.currentUser());
    }

    public HistoryResponseDTO findByUserForCurrent(Long userId) {
        authContextService.requireSelfTrainerAssignedOrAdmin(userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return buildHistory(user);
    }

    private HistoryResponseDTO buildHistory(User user) {
        List<Progress> progressRecords = progressRepository.findByUserIdOrderByDateDesc(user.getId());
        List<Routine> routines = routineRepository.findByOwnerId(user.getId());

        HistoryResponseDTO response = new HistoryResponseDTO();
        response.setUserId(user.getId());
        response.setUserName(user.getName());
        response.setEmail(user.getEmail());
        response.setSummary(buildSummary(progressRecords, routines));
        response.setEntries(progressRecords.stream().map(this::toEntry).toList());
        return response;
    }

    private HistorySummaryDTO buildSummary(List<Progress> progressRecords, List<Routine> routines) {
        HistorySummaryDTO summary = new HistorySummaryDTO();
        summary.setTotalProgressEntries(progressRecords.size());
        summary.setTotalMinutes(progressRecords.stream().mapToLong(progress -> value(progress.getTimeMinutes())).sum());
        summary.setTotalRepetitions(progressRecords.stream().mapToLong(progress -> value(progress.getRepetitions())).sum());
        summary.setAverageEffortLevel(averageEffort(progressRecords));
        summary.setLastActivityDate(progressRecords.stream()
                .map(Progress::getDate)
                .filter(Objects::nonNull)
                .max(LocalDate::compareTo)
                .orElse(null));
        summary.setCompletedRoutineCount(progressRecords.stream()
                .map(Progress::getRoutine)
                .filter(Objects::nonNull)
                .map(Routine::getId)
                .distinct()
                .count());
        summary.setActiveRoutineCount(routines.stream().filter(Routine::isActive).count());
        return summary;
    }

    private HistoryEntryDTO toEntry(Progress progress) {
        HistoryEntryDTO entry = new HistoryEntryDTO();
        entry.setProgressId(progress.getId());
        entry.setDate(progress.getDate());
        entry.setPeriodType(progress.getPeriodType());
        if (progress.getRoutine() != null) {
            entry.setRoutineId(progress.getRoutine().getId());
            entry.setRoutineName(progress.getRoutine().getName());
        }
        if (progress.getExercise() != null) {
            entry.setExerciseId(progress.getExercise().getId());
            entry.setExerciseName(progress.getExercise().getName());
        }
        entry.setRepetitions(progress.getRepetitions());
        entry.setTimeMinutes(progress.getTimeMinutes());
        entry.setEffortLevel(progress.getEffortLevel());
        entry.setWeight(progress.getWeight());
        entry.setNotes(progress.getNotes());
        return entry;
    }

    private long value(Integer value) {
        return value == null ? 0 : value;
    }

    private Double averageEffort(List<Progress> progressRecords) {
        List<Double> values = progressRecords.stream()
                .map(Progress::getEffortLevel)
                .map(this::effortToNumber)
                .filter(Objects::nonNull)
                .toList();
        if (values.isEmpty()) {
            return null;
        }
        return values.stream().mapToDouble(Double::doubleValue).average().orElse(0);
    }

    private Double effortToNumber(String effortLevel) {
        if (effortLevel == null || effortLevel.isBlank()) {
            return null;
        }
        try {
            return Double.parseDouble(effortLevel.trim());
        } catch (NumberFormatException ignored) {
            String normalized = effortLevel.trim().toLowerCase();
            if (normalized.equals("low") || normalized.equals("bajo")) {
                return 1.0;
            }
            if (normalized.equals("medium") || normalized.equals("medio")) {
                return 2.0;
            }
            if (normalized.equals("high") || normalized.equals("alto")) {
                return 3.0;
            }
            return null;
        }
    }
}
