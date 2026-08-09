package co.icesi.TallerJPA.mapper;

import co.icesi.TallerJPA.dto.request.RoleRequestDTO;
import co.icesi.TallerJPA.dto.response.RoleResponseDTO;
import co.icesi.TallerJPA.model.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = PermissionMapper.class)
public interface RoleMapper {

    RoleResponseDTO entityToDto(Role role);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "description", ignore = true)
    @Mapping(target = "permissions", ignore = true)
    @Mapping(target = "users", ignore = true)
    Role dtoToEntity(RoleRequestDTO dto);
}
