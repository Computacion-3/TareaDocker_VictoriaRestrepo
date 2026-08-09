package co.icesi.TallerJPA.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class EventRequestDTO {

    @NotBlank
    private String name;

    @NotBlank
    private String description;

    @NotNull
    private LocalDateTime dateTime;

    @NotBlank
    private String location;

    @NotNull
    @JsonAlias("espacioIds")
    private List<Long> spaceIds;

    @NotNull
    private List<Long> userIds;
}
