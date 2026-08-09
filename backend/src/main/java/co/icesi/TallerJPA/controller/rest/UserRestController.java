package co.icesi.TallerJPA.controller.rest;

import co.icesi.TallerJPA.dto.request.UserRequestDTO;
import co.icesi.TallerJPA.dto.response.UserResponseDTO;
import co.icesi.TallerJPA.mapper.UserMapper;
import co.icesi.TallerJPA.services.AuthContextService;
import co.icesi.TallerJPA.services.UserService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
public class UserRestController {

    private final UserService userService;
    private final UserMapper userMapper;
    private final AuthContextService authContextService;

    public UserRestController(
            UserService userService,
            UserMapper userMapper,
            AuthContextService authContextService
    ) {
        this.userService = userService;
        this.userMapper = userMapper;
        this.authContextService = authContextService;
    }

    @GetMapping
    public List<UserResponseDTO> getAll() {
        authContextService.requireAdmin();
        return userService.getAllUsers().stream().map(userMapper::entityToDto).toList();
    }

    @GetMapping("/{id}")
    public UserResponseDTO getById(@PathVariable Long id) {
        authContextService.requireSelfOrAdmin(id);
        return userMapper.entityToDto(userService.findById(id));
    }

    @GetMapping("/me")
    public UserResponseDTO getMe() {
        return userMapper.entityToDto(authContextService.currentUser());
    }

    @PostMapping
    public UserResponseDTO create(@Valid @RequestBody UserRequestDTO dto) {
        authContextService.requireAdmin();
        return userMapper.entityToDto(userService.createUser(dto));
    }

    @PutMapping("/{id}")
    public UserResponseDTO update(@PathVariable Long id, @Valid @RequestBody UserRequestDTO dto) {
        authContextService.requireAdmin();
        return userMapper.entityToDto(userService.updateUser(id, dto));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        authContextService.requireAdmin();
        userService.deleteUser(id);
    }

    @GetMapping("/trainers")
    public List<UserResponseDTO> getTrainers() {
        authContextService.requireAdmin();
        return userService.getAllTrainers().stream().map(userMapper::entityToDto).toList();
    }

    @GetMapping("/regular")
    public List<UserResponseDTO> getRegularUsers() {
        authContextService.requireAdmin();
        return userService.getRegularUsers().stream().map(userMapper::entityToDto).toList();
    }
}
