package co.icesi.TallerJPA.controller.rest;

import co.icesi.TallerJPA.dto.response.HistoryResponseDTO;
import co.icesi.TallerJPA.services.HistoryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/history")
public class HistoryRestController {

    private final HistoryService historyService;

    public HistoryRestController(HistoryService historyService) {
        this.historyService = historyService;
    }

    @GetMapping("/me")
    public HistoryResponseDTO getMine() {
        return historyService.findMine();
    }

    @GetMapping("/users/{userId}")
    public HistoryResponseDTO getByUser(@PathVariable Long userId) {
        return historyService.findByUserForCurrent(userId);
    }
}
