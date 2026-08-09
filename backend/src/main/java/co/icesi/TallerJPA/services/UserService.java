package co.icesi.TallerJPA.services;

import co.icesi.TallerJPA.dto.request.UserRequestDTO;
import co.icesi.TallerJPA.exception.BadRequestException;
import co.icesi.TallerJPA.exception.DuplicateResourceException;
import co.icesi.TallerJPA.exception.ResourceNotFoundException;
import co.icesi.TallerJPA.model.Role;
import co.icesi.TallerJPA.model.User;
import co.icesi.TallerJPA.repository.RoleRepository;
import co.icesi.TallerJPA.repository.UserRepository;
import co.icesi.TallerJPA.security.UserDetailCustom;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {

    public static final String INSTITUTIONAL_DOMAIN = "@icesi.edu.co";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = null;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        if (!isInstitutionalEmail(email)) {
            throw new UsernameNotFoundException("Email institucional invalido");
        }
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));
        return new UserDetailCustom(user);
    }

    public User createUser(User user) {
        validateInstitutionalEmail(user.getEmail());
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists");
        }
        if (user.getRole() == null || user.getRole().getId() == null) {
            throw new RuntimeException("User must have at least one role");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User createUser(UserRequestDTO dto) {
        requireRoleRepository();
        validateInstitutionalEmail(dto.getEmail());
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("User already exists");
        }

        Role role = roleRepository.findById(dto.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(role);
        user.setActive(true);

        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getAllTrainers() {
        return userRepository.findByRoleName("TRAINER");
    }

    public List<User> getRegularUsers() {
        return userRepository.findByRoleName("USER");
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User updateUser(Long id, User updatedUser) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        validateInstitutionalEmail(updatedUser.getEmail());
        existing.setName(updatedUser.getName());
        existing.setEmail(updatedUser.getEmail());
        existing.setRole(updatedUser.getRole());
        existing.setActive(updatedUser.isActive());

        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            existing.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        return userRepository.save(existing);
    }

    public User updateUser(Long id, UserRequestDTO dto) {
        requireRoleRepository();
        validateInstitutionalEmail(dto.getEmail());
        User existing = findById(id);
        Role role = roleRepository.findById(dto.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        if (!existing.getEmail().equals(dto.getEmail()) && userRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("User email already exists");
        }

        existing.setName(dto.getName());
        existing.setEmail(dto.getEmail());
        existing.setRole(role);
        existing.setActive(true);

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        return userRepository.save(existing);
    }

    private void requireRoleRepository() {
        if (roleRepository == null) {
            throw new IllegalStateException("RoleRepository is required for DTO-based user operations");
        }
    }

    public static boolean isInstitutionalEmail(String email) {
        return email != null && email.toLowerCase().endsWith(INSTITUTIONAL_DOMAIN);
    }

    public static void validateInstitutionalEmail(String email) {
        if (!isInstitutionalEmail(email)) {
            throw new BadRequestException("El email debe terminar en " + INSTITUTIONAL_DOMAIN);
        }
    }
}
