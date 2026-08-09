package co.icesi.TallerJPA.services;

import co.icesi.TallerJPA.model.Permission;
import co.icesi.TallerJPA.model.Role;
import co.icesi.TallerJPA.repository.RoleRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoleServiceTest {

    @Mock
    private RoleRepository roleRepository;

    @InjectMocks
    private RoleService roleService;

    private Role role;
    private Permission permission;

    @BeforeEach
    void setUp() {

        permission = new Permission();
        permission.setId(1L);
        permission.setName("READ");

        role = new Role();
        role.setId(1L);
        role.setName("ESTUDIANTE");
        role.setPermissions(Set.of(permission));
    }

    @Test
    void createRole_success() {

        when(roleRepository.findByName(role.getName()))
                .thenReturn(Optional.empty());

        when(roleRepository.save(role))
                .thenReturn(role);

        Role result = roleService.createRole(role);

        assertNotNull(result);
        assertEquals("ESTUDIANTE", result.getName());

        verify(roleRepository).save(role);
    }

    @Test
    void createRole_throwsException_whenRoleExists() {

        when(roleRepository.findByName(role.getName()))
                .thenReturn(Optional.of(role));

        assertThrows(
                RuntimeException.class,
                () -> roleService.createRole(role)
        );

        verify(roleRepository, never()).save(any());
    }

    @Test
    void createRole_throwsException_whenPermissionsInvalid() {

        role.setPermissions(null);

        when(roleRepository.findByName(role.getName()))
                .thenReturn(Optional.empty());

        assertThrows(
                RuntimeException.class,
                () -> roleService.createRole(role)
        );
    }

    @Test
    void getRoleById_success() {

        when(roleRepository.findById(1L))
                .thenReturn(Optional.of(role));

        Role result = roleService.getRoleById(1L);

        assertNotNull(result);
    }

    @Test
    void getRoleById_returnsNull() {

        when(roleRepository.findById(99L))
                .thenReturn(Optional.empty());

        Role result = roleService.getRoleById(99L);

        assertNull(result);
    }

    @Test
    void getAllRoles_success() {

        when(roleRepository.findAll())
                .thenReturn(List.of(role));

        List<Role> result = roleService.getAllRoles();

        assertEquals(1, result.size());
    }

    @Test
    void deleteRole_success() {

        doNothing().when(roleRepository).deleteById(1L);

        roleService.deleteRole(1L);

        verify(roleRepository).deleteById(1L);
    }

    @Test
    void updateRole_success() {

        Role updated = new Role();
        updated.setName("ENTRENADOR");
        updated.setPermissions(Set.of(permission));

        when(roleRepository.findById(1L))
                .thenReturn(Optional.of(role));

        when(roleRepository.save(any()))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Role result = roleService.updateRole(1L, updated);

        assertEquals("ENTRENADOR", result.getName());
    }

    @Test
    void updateRole_notFound() {

        when(roleRepository.findById(99L))
                .thenReturn(Optional.empty());

        assertThrows(
                RuntimeException.class,
                () -> roleService.updateRole(99L, new Role())
        );
    }
}