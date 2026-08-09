package co.icesi.TallerJPA.mapper;

import java.util.stream.Collectors;
import java.util.List;

import org.springframework.stereotype.Component;

import co.icesi.TallerJPA.dto.response.EventResponseDTO;
import co.icesi.TallerJPA.dto.response.SpaceResponseDTO;
import co.icesi.TallerJPA.dto.response.UserResponseDTO;
import co.icesi.TallerJPA.model.Event;
import co.icesi.TallerJPA.model.Space;
import co.icesi.TallerJPA.model.User;

@Component
public class EventMapper {

    public EventResponseDTO toResponseDTO(Event event) {

        EventResponseDTO dto = new EventResponseDTO();

        dto.setId(event.getId());
        dto.setName(event.getName());
        dto.setDescription(event.getDescription());
        dto.setEventType(event.getEventType());
        dto.setDateTime(event.getDateTime());
        dto.setEndDateTime(event.getEndDateTime());
        dto.setCapacity(event.getCapacity());
        dto.setLocation(event.getLocation());
        dto.setActive(event.isActive());
        dto.setCreatedAt(event.getCreatedAt());
        dto.setUpdatedAt(event.getUpdatedAt());

        List<Space> spaces = event.getSpaces() == null ? List.of() : event.getSpaces();
        dto.setSpaces(spaces.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList()));

        List<User> users = event.getUsers() == null ? List.of() : event.getUsers();
        dto.setUsers(users.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList()));

        if (event.getCreatedBy() != null) {
            dto.setCreatedById(event.getCreatedBy().getId());
            dto.setCreatedByName(event.getCreatedBy().getName());
        }

        return dto;
    }

    private SpaceResponseDTO toResponseDTO(Space space) {
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

    private UserResponseDTO toResponseDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();

        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setActive(user.isActive());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        dto.setRoleId(user.getRole() != null ? user.getRole().getId() : null);
        dto.setRoleName(user.getRole() != null ? user.getRole().getName() : null);

        return dto;
    }
}
