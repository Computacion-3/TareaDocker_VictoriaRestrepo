package co.icesi.TallerJPA.services;

import co.icesi.TallerJPA.model.Role;
import co.icesi.TallerJPA.model.User;
import co.icesi.TallerJPA.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User user;
    private Role role;

    @BeforeEach
    void setUp() {

        role = new Role();
        role.setId(1L);
        role.setName("ESTUDIANTE");

        user = new User();
        user.setId(1L);
        user.setName("Melissa");
        user.setEmail("melissa@icesi.edu.co");
        user.setPassword("1234");
        user.setRole(role);
    }

    // CREATE USER

    @Test
    void createUser_success() {
        when(userRepository.findByEmail(user.getEmail()))
                .thenReturn(Optional.empty());

        when(passwordEncoder.encode(any()))
                .thenReturn("encodedPassword");

        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.createUser(user);

        assertNotNull(result);
        assertEquals("melissa@icesi.edu.co", result.getEmail());
        assertEquals("encodedPassword", result.getPassword());

        verify(userRepository).findByEmail(user.getEmail());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void createUser_throwsException_whenUserExists() {

        when(userRepository.findByEmail(user.getEmail()))
                .thenReturn(Optional.of(user));

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> userService.createUser(user)
        );

        assertEquals("User already exists", ex.getMessage());

        verify(userRepository).findByEmail(user.getEmail());
        verify(userRepository, never()).save(any());
    }

    @Test
    void createUser_throwsException_whenRoleIsNull() {

        user.setRole(null);

        when(userRepository.findByEmail(user.getEmail()))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> userService.createUser(user)
        );

        assertEquals("User must have at least one role", ex.getMessage());

        verify(userRepository, never()).save(any());
    }

    // GET USER BY ID

    @Test
    void getUserById_returnsUser_whenExists() {

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        User result = userService.getUserById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void getUserById_returnsNull_whenNotExists() {

        when(userRepository.findById(99L))
                .thenReturn(Optional.empty());

        User result = userService.getUserById(99L);

        assertNull(result);
    }

    // GET ALL USERS

    @Test
    void getAllUsers_returnsUsers() {

        when(userRepository.findAll())
                .thenReturn(List.of(user));

        List<User> result = userService.getAllUsers();

        assertEquals(1, result.size());
        assertEquals("Melissa", result.get(0).getName());
    }

    @Test
    void getAllUsers_returnsEmptyList() {

        when(userRepository.findAll())
                .thenReturn(List.of());

        List<User> result = userService.getAllUsers();

        assertTrue(result.isEmpty());
    }

    // DELETE USER

    @Test
    void deleteUser_callsRepository() {

        doNothing().when(userRepository).deleteById(1L);

        userService.deleteUser(1L);

        verify(userRepository, times(1)).deleteById(1L);
    }

    // UPDATE USER

    @Test
    void updateUser_success() {
        User updated = new User();
        updated.setName("Melissa Updated");
        updated.setEmail("new@icesi.edu.co");
        updated.setPassword("newpass");

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.encode(any()))
                .thenReturn("encodedPassword");

        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.updateUser(1L, updated);

        assertEquals("Melissa Updated", result.getName());
        assertEquals("new@icesi.edu.co", result.getEmail());
        assertEquals("encodedPassword", result.getPassword());

        verify(userRepository).save(any(User.class));
    }

    @Test
    void updateUser_throwsException_whenNotFound() {

        when(userRepository.findById(99L))
                .thenReturn(Optional.empty());

        assertThrows(
                RuntimeException.class,
                () -> userService.updateUser(99L, new User())
        );
    }
}
