package co.icesi.TallerJPA.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.Set;
import lombok.Data;

@Data
public class RoleRequestDTO {

    @NotBlank
    private String name;

    @NotEmpty
    private Set<Long> permissionIds;
}
