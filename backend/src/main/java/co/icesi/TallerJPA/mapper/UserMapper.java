package co.icesi.TallerJPA.mapper;

import co.icesi.TallerJPA.dto.request.UserRequestDTO;
import co.icesi.TallerJPA.dto.response.UserResponseDTO;
import co.icesi.TallerJPA.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "roleId", source = "role.id")
    @Mapping(target = "roleName", source = "role.name")
    UserResponseDTO entityToDto(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "active", constant = "true")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "ownedRoutines", ignore = true)
    @Mapping(target = "createdRoutines", ignore = true)
    @Mapping(target = "progressRecords", ignore = true)
    @Mapping(target = "notifications", ignore = true)
    @Mapping(target = "events", ignore = true)
    @Mapping(target = "trainerAssignments", ignore = true)
    @Mapping(target = "userAssignments", ignore = true)
    @Mapping(target = "sentRecommendations", ignore = true)
    @Mapping(target = "receivedRecommendations", ignore = true)
    @Mapping(target = "createdExercises", ignore = true)
    User dtoToEntity(UserRequestDTO dto);
}
