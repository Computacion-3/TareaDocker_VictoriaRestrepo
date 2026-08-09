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

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private User user;

    @BeforeEach
    void setUp() {

        Role role = new Role();
        role.setId(1L);
        role.setName("ESTUDIANTE");

        user = new User();
        user.setId(1L);
        user.setName("Melissa");
        user.setEmail("melissa@icesi.edu.co");
        user.setPassword("encodedPassword");
        user.setRole(role);
    }

    // LOGIN EXITOSO

    @Test
    void login_success() {

        when(userRepository.findByEmail("melissa@icesi.edu.co"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches("1234", "encodedPassword"))
                .thenReturn(true);

        User result = authService.login("melissa@icesi.edu.co", "1234");

        assertNotNull(result);
        assertEquals("melissa@icesi.edu.co", result.getEmail());

        verify(userRepository).findByEmail("melissa@icesi.edu.co");
        verify(passwordEncoder).matches("1234", "encodedPassword");
    }

    // USUARIO NO EXISTE

    @Test
    void login_throwsException_whenUserNotFound() {

        when(userRepository.findByEmail("melissa@icesi.edu.co"))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> authService.login("melissa@icesi.edu.co", "1234")
        );

        assertEquals("Usuario no encontrado: melissa@icesi.edu.co", ex.getMessage());

        verify(userRepository).findByEmail("melissa@icesi.edu.co");
        verify(passwordEncoder, never()).matches(any(), any());
    }

    // CONTRASEÑA INCORRECTA

    @Test
    void login_throwsException_whenPasswordIncorrect() {

        when(userRepository.findByEmail("melissa@icesi.edu.co"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches("wrongpass", "encodedPassword"))
                .thenReturn(false);

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> authService.login("melissa@icesi.edu.co", "wrongpass")
        );

        assertEquals("Contraseña incorrecta", ex.getMessage());

        verify(userRepository).findByEmail("melissa@icesi.edu.co");
        verify(passwordEncoder).matches("wrongpass", "encodedPassword");
    }
}