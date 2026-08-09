package co.icesi.TallerJPA.controller.rest;

import co.icesi.TallerJPA.dto.response.RoleResponseDTO;
import co.icesi.TallerJPA.mapper.RoleMapper;
import co.icesi.TallerJPA.services.AuthContextService;
import co.icesi.TallerJPA.services.RoleService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/roles")
public class RoleRestController {

    private final RoleService roleService;
    private final RoleMapper roleMapper;
    private final AuthContextService authContextService;

    public RoleRestController(RoleService roleService, RoleMapper roleMapper, AuthContextService authContextService) {
        this.roleService = roleService;
        this.roleMapper = roleMapper;
        this.authContextService = authContextService;
    }

    @GetMapping
    public List<RoleResponseDTO> getAll() {
        authContextService.requireAdmin();
        return roleService.getAllRoles().stream().map(roleMapper::entityToDto).toList();
    }

    @GetMapping("/{id}")
    public RoleResponseDTO getById(@PathVariable Long id) {
        authContextService.requireAdmin();
        return roleMapper.entityToDto(roleService.getRoleById(id));
    }
}
