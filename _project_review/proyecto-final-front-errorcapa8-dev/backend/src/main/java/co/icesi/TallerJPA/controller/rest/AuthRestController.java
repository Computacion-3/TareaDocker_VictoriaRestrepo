package co.icesi.TallerJPA.controller.rest;

import co.icesi.TallerJPA.dto.request.LoginRequestDTO;
import co.icesi.TallerJPA.dto.response.TokenResponseDTO;
import co.icesi.TallerJPA.dto.response.UserResponseDTO;
import co.icesi.TallerJPA.model.User;
import co.icesi.TallerJPA.security.UserDetailCustom;
import co.icesi.TallerJPA.security.jwt.JwtTokenProvider;
import co.icesi.TallerJPA.services.AuthContextService;
import co.icesi.TallerJPA.services.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthRestController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final AuthContextService authContextService;

    public AuthRestController(
            AuthenticationManager authenticationManager,
            JwtTokenProvider tokenProvider,
            AuthContextService authContextService
    ) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.authContextService = authContextService;
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponseDTO> authenticateUser(@Valid @RequestBody LoginRequestDTO loginRequest) {
        UserService.validateInstitutionalEmail(loginRequest.getEmail());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);

        UserDetailCustom userDetails = (UserDetailCustom) authentication.getPrincipal();
        User user = userDetails.getUser();

        UserResponseDTO userResponse = new UserResponseDTO();
        userResponse.setId(user.getId());
        userResponse.setName(user.getName());
        userResponse.setEmail(user.getEmail());
        userResponse.setActive(user.isActive());
        userResponse.setCreatedAt(user.getCreatedAt());
        userResponse.setUpdatedAt(user.getUpdatedAt());
        userResponse.setRoleId(user.getRole().getId());
        userResponse.setRoleName(user.getRole().getName());

        List<String> roles = List.of(user.getRole().getName());

        TokenResponseDTO tokenResponse = new TokenResponseDTO(
                jwt,
                "Bearer",
                tokenProvider.getIssuedAtFromToken(jwt).toInstant(),
                tokenProvider.getExpirationDateFromToken(jwt).toInstant(),
                userResponse,
                roles
        );

        return ResponseEntity.ok(tokenResponse);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> currentUser() {
        return ResponseEntity.ok(toUserResponse(authContextService.currentUser()));
    }

    private UserResponseDTO toUserResponse(User user) {
        UserResponseDTO userResponse = new UserResponseDTO();
        userResponse.setId(user.getId());
        userResponse.setName(user.getName());
        userResponse.setEmail(user.getEmail());
        userResponse.setActive(user.isActive());
        userResponse.setCreatedAt(user.getCreatedAt());
        userResponse.setUpdatedAt(user.getUpdatedAt());
        userResponse.setRoleId(user.getRole().getId());
        userResponse.setRoleName(user.getRole().getName());
        return userResponse;
    }
}
