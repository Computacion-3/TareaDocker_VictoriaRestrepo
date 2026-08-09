package co.icesi.TallerJPA.dto.response;

import java.util.Set;
import lombok.Data;

@Data
public class RoleResponseDTO {

    private Long id;
    private String name;
    private String description;
    private Set<PermissionResponseDTO> permissions;
}
