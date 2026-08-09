package co.icesi.TallerJPA.mapper;

import org.springframework.stereotype.Component;

import co.icesi.TallerJPA.dto.response.SpaceResponseDTO;
import co.icesi.TallerJPA.model.Space;

@Component
public class SpaceMapper {

    public SpaceResponseDTO toResponseDTO(Space space) {

        SpaceResponseDTO dto = new SpaceResponseDTO();

        dto.setId(space.getId());
        dto.setName(space.getName());
        dto.setType(space.getType());
        dto.setDescription(space.getDescription());
        dto.setLocation(space.getLocation());
        dto.setAvailable(space.isAvailable());
        dto.setCapacity(space.getCapacity());
        dto.setOpeningHours(space.getOpeningHours());
        dto.setClosingHours(space.getClosingHours());
        dto.setActive(space.isActive());
        dto.setCreatedAt(space.getCreatedAt());
        dto.setUpdatedAt(space.getUpdatedAt());

        return dto;
    }
}
