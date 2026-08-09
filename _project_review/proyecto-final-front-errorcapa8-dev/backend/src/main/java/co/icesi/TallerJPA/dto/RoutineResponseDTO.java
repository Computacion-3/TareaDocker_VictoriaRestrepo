package co.icesi.TallerJPA.dto;

import lombok.Data;

import java.util.List;

@Data
public class RoutineResponseDTO {

    private Long id;
    private String name;
    private String description;
    private Long ownerId;
    private List<Long> exerciseIds;
}
