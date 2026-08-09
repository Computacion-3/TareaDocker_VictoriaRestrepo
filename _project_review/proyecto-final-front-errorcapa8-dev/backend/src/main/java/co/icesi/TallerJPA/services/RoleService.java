package co.icesi.TallerJPA.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import co.icesi.TallerJPA.model.Role;
import co.icesi.TallerJPA.repository.RoleRepository;


@Service
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public Role createRole(Role role) {

        if(roleRepository.findByName(role.getName()).isPresent()){
            throw new RuntimeException("Role already exists");
        }

        if(role.getPermissions() == null || role.getPermissions().isEmpty()){
            throw new RuntimeException("Role must have at least one permission");
        }
        return roleRepository.save(role);
    }

    public Role getRoleById(Long id){
        return roleRepository.findById(id).orElse(null);

    }

    public Optional<Role> getRoleByName(String name){
        return roleRepository.findByName(name);
    }

    public List<Role> getAllRoles(){
        return roleRepository.findAll();
    }

    public List<Role> searchRole(Long id){
        return roleRepository.findById(id)
                .map(List::of)
                .orElse(List.of());
    }

    public void deleteRole(Long id){
        roleRepository.deleteById(id);
    }

    public Role updateRole(Long id, Role updatedRole) {
        Role existing = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        existing.setName(updatedRole.getName());
        existing.setPermissions(updatedRole.getPermissions());
        return roleRepository.save(existing);
    }




}
