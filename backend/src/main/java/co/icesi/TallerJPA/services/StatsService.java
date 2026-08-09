package co.icesi.TallerJPA.services;

import co.icesi.TallerJPA.dto.response.StatsPointDTO;
import co.icesi.TallerJPA.dto.response.StatsResponseDTO;
import co.icesi.TallerJPA.exception.ResourceNotFoundException;
import co.icesi.TallerJPA.model.Progress;
import co.icesi.TallerJPA.model.User;
import co.icesi.TallerJPA.repository.ProgressRepository;
import co.icesi.TallerJPA.repository.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class StatsService {

    private final ProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final AuthContextService authContextService;

    public StatsService(
            ProgressRepository progressRepository,
            UserRepository userRepository,
            AuthContextService authContextService
    ) {
        this.progressRepository = progressRepository;
        this.userRepository = userRepository;
        this.authContextService = authContextService;
    }

    public StatsResponseDTO weeklyMine() {
        return buildStats(authContextService.currentUser(), "weekly", LocalDate.now().minusDays(6), LocalDate.now());
    }

    public StatsResponseDTO monthlyMine() {
        return buildStats(authContextService.currentUser(), "monthly", LocalDate.now().minusDays(29), LocalDate.now());
    }

    public StatsResponseDTO weeklyForUser(Long userId) {
        authContextService.requireSelfTrainerAssignedOrAdmin(userId);
        return buildStats(findUser(userId), "weekly", LocalDate.now().minusDays(6), LocalDate.now());
    }

    public StatsResponseDTO monthlyForUser(Long userId) {
        authContextService.requireSelfTrainerAssignedOrAdmin(userId);
        return buildStats(findUser(userId), "monthly", LocalDate.now().minusDays(29), LocalDate.now());
    }

    private StatsResponseDTO buildStats(User user, String period, LocalDate startDate, LocalDate endDate) {
        List<Progress> progressRecords = progressRepository
                .findByUserIdAndDateBetweenOrderByDateAsc(user.getId(), startDate, endDate);

        StatsResponseDTO response = new StatsResponseDTO();
        response.setUserId(user.getId());
        response.setUserName(user.getName());
        response.setPeriod(period);
        response.setStartDate(startDate);
        response.setEndDate(endDate);
        response.setTotalProgressEntries(progressRecords.size());
        response.setTotalMinutes(progressRecords.stream().mapToLong(progress -> value(progress.getTimeMinutes())).sum());
        response.setTotalRepetitions(progressRecords.stream().mapToLong(progress -> value(progress.getRepetitions())).sum());
        response.setAverageEffortLevel(averageEffort(progressRecords));
        response.setTotalWeightVolume(totalWeightVolume(progressRecords));
        response.setPoints(buildPoints(progressRecords));
        return response;
    }

    private List<StatsPointDTO> buildPoints(List<Progress> progressRecords) {
        Map<LocalDate, List<Progress>> byDate = progressRecords.stream()
                .filter(progress -> progress.getDate() != null)
                .collect(Collectors.groupingBy(Progress::getDate));

        return byDate.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> toPoint(entry.getKey(), entry.getValue()))
                .toList();
    }

    private StatsPointDTO toPoint(LocalDate date, List<Progress> progressRecords) {
        StatsPointDTO point = new StatsPointDTO();
        point.setDate(date);
        point.setLabel(date.toString());
        point.setEntriesCount(progressRecords.size());
        point.setTotalMinutes(progressRecords.stream().mapToLong(progress -> value(progress.getTimeMinutes())).sum());
        point.setTotalRepetitions(progressRecords.stream().mapToLong(progress -> value(progress.getRepetitions())).sum());
        point.setAverageEffortLevel(averageEffort(progressRecords));
        return point;
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private long value(Integer value) {
        return value == null ? 0 : value;
    }

    private BigDecimal totalWeightVolume(List<Progress> progressRecords) {
        return progressRecords.stream()
                .filter(progress -> progress.getWeight() != null)
                .map(progress -> progress.getWeight().multiply(BigDecimal.valueOf(value(progress.getRepetitions()))))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
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
