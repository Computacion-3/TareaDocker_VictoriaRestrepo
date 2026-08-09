package co.icesi.TallerJPA.dto.response;

import java.time.Instant;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TokenResponseDTO {

    private String token;
    private String type;
    private Instant issuedAt;
    private Instant expiresAt;
    private UserResponseDTO user;
    private List<String> roles;
}
