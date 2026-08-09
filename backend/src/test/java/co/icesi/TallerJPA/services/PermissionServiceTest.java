package co.icesi.TallerJPA.services;

import co.icesi.TallerJPA.model.Permission;
import co.icesi.TallerJPA.repository.PermissionRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PermissionServiceTest {

    @Mock
    private PermissionRepository permissionRepository;

    @InjectMocks
    private PermissionService permissionService;

    private Permission permission;

    @BeforeEach
    void setUp() {

        permission = new Permission();
        permission.setId(1L);
        permission.setName("READ");
        permission.setDescription("Permiso de lectura");
    }

    @Test
    void createPermission_success() {

        when(permissionRepository.findByName(permission.getName()))
                .thenReturn(Optional.empty());

        when(permissionRepository.save(permission))
                .thenReturn(permission);

        Permission result = permissionService.createPermission(permission);

        assertNotNull(result);
        assertEquals("READ", result.getName());

        verify(permissionRepository).save(permission);
    }

    @Test
    void createPermission_duplicate() {

        when(permissionRepository.findByName(permission.getName()))
                .thenReturn(Optional.of(permission));

        assertThrows(
                RuntimeException.class,
                () -> permissionService.createPermission(permission)
        );

        verify(permissionRepository, never()).save(any());
    }

    @Test
    void getPermissionByName_success() {

        when(permissionRepository.findByName("READ"))
                .thenReturn(Optional.of(permission));

        Optional<Permission> result = permissionService.getPermissionByName("READ");

        assertTrue(result.isPresent());
    }

    @Test
    void getPermissionByName_empty() {

        when(permissionRepository.findByName("WRITE"))
                .thenReturn(Optional.empty());

        Optional<Permission> result = permissionService.getPermissionByName("WRITE");

        assertTrue(result.isEmpty());
    }

    @Test
    void getAllPermissions_success() {

        when(permissionRepository.findAll())
                .thenReturn(List.of(permission));

        List<Permission> result = permissionService.getAllPermissions();

        assertEquals(1, result.size());
    }

    @Test
    void deletePermission_success() {

        doNothing().when(permissionRepository).deleteById(1L);

        permissionService.deletePermission(1L);

        verify(permissionRepository).deleteById(1L);
    }

    @Test
    void updatePermission_success() {

        Permission updated = new Permission();
        updated.setName("WRITE");
        updated.setDescription("Permiso escritura");

        when(permissionRepository.findById(1L))
                .thenReturn(Optional.of(permission));

        when(permissionRepository.save(any()))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Permission result = permissionService.updatePermission(1L, updated);

        assertEquals("WRITE", result.getName());
    }

    @Test
    void updatePermission_notFound() {

        when(permissionRepository.findById(99L))
                .thenReturn(Optional.empty());

        assertThrows(
                RuntimeException.class,
                () -> permissionService.updatePermission(99L, new Permission())
        );
    }
}