package co.icesi.TallerJPA.dto.request;

import lombok.Data;

@Data
public class TrainerRoutineAssignmentRequestDTO {

    private Long templateId;
    private Long routineId;
    private String name;
    private String description;
}
