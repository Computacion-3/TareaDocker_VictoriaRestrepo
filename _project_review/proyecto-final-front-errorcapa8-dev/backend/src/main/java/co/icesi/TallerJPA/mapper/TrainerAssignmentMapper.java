package co.icesi.TallerJPA.mapper;

import co.icesi.TallerJPA.dto.response.TrainerAssignmentResponseDTO;
import co.icesi.TallerJPA.model.TrainerAssignment;
import org.springframework.stereotype.Component;

@Component
public class TrainerAssignmentMapper {

    public TrainerAssignmentResponseDTO toResponseDTO(TrainerAssignment assignment) {
        TrainerAssignmentResponseDTO dto = new TrainerAssignmentResponseDTO();
        dto.setId(assignment.getId());
        if (assignment.getTrainer() != null) {
            dto.setTrainerId(assignment.getTrainer().getId());
            dto.setTrainerName(assignment.getTrainer().getName());
        }
        if (assignment.getAssignedUser() != null) {
            dto.setAssignedUserId(assignment.getAssignedUser().getId());
            dto.setAssignedUserName(assignment.getAssignedUser().getName());
        }
        dto.setAssignedAt(assignment.getAssignedAt());
        dto.setActive(assignment.isActive());
        return dto;
    }
}
