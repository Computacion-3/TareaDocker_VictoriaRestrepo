package co.icesi.TallerJPA.controller.rest;

import co.icesi.TallerJPA.dto.response.StatsResponseDTO;
import co.icesi.TallerJPA.services.StatsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/stats")
public class StatsRestController {

    private final StatsService statsService;

    public StatsRestController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/me/weekly")
    public StatsResponseDTO getMyWeeklyStats() {
        return statsService.weeklyMine();
    }

    @GetMapping("/me/monthly")
    public StatsResponseDTO getMyMonthlyStats() {
        return statsService.monthlyMine();
    }

    @GetMapping("/users/{userId}/weekly")
    public StatsResponseDTO getUserWeeklyStats(@PathVariable Long userId) {
        return statsService.weeklyForUser(userId);
    }

    @GetMapping("/users/{userId}/monthly")
    public StatsResponseDTO getUserMonthlyStats(@PathVariable Long userId) {
        return statsService.monthlyForUser(userId);
    }
}
