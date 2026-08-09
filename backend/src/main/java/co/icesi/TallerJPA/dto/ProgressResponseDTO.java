package co.icesi.TallerJPA.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ProgressResponseDTO {

    private Long id;
    private LocalDate date;
    private Integer repetitions;
    private String effortLevel;
    private String notes;
    private Long userId;
}
