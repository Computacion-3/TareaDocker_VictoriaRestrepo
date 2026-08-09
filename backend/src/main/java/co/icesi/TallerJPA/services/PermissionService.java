package co.icesi.TallerJPA.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import co.icesi.TallerJPA.model.Permission;
import co.icesi.TallerJPA.repository.PermissionRepository;

@Service
public class PermissionService {

    private final PermissionRepository permissionRepository;   

    public PermissionService(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }
 
    public Permission createPermission(Permission permission) {
        if(permissionRepository.findByName(permission.getName()).isPresent()){
            throw new RuntimeException("Permission already exists");
        }
        return permissionRepository.save(permission);
        
    }
    
    public Optional<Permission> getPermissionByName(String name) {
        return permissionRepository.findByName(name);
    }

    public List<Permission> getAllPermissions() {
        return permissionRepository.findAll();
    }

    public void deletePermission(Long id) {
        permissionRepository.deleteById(id);
    }

    public Permission updatePermission(Long id, Permission updatedPermission) {
        Permission existing = permissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Permission not found"));
        existing.setName(updatedPermission.getName());
        existing.setDescription(updatedPermission.getDescription());
        return permissionRepository.save(existing);
    }
}
