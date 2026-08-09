package co.icesi.TallerJPA.mapper;

import co.icesi.TallerJPA.dto.request.PermissionRequestDTO;
import co.icesi.TallerJPA.dto.response.PermissionResponseDTO;
import co.icesi.TallerJPA.model.Permission;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PermissionMapper {

    PermissionResponseDTO entityToDto(Permission permission);

    @Mapping(target = "id", ignore = true)
    Permission dtoToEntity(PermissionRequestDTO dto);
}
