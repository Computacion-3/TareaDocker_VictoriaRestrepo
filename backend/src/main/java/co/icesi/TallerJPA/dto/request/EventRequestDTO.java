package co.icesi.TallerJPA.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
public class EventRequestDTO {

    @NotBlank
    private String name;

    @NotBlank
    private String description;

    private String eventType;

    @NotNull
    private LocalDateTime dateTime;

    private LocalDateTime endDateTime;

    private Integer capacity;

    @NotBlank
    private String location;

    @JsonAlias("espacioIds")
    private List<Long> spaceIds;

    private List<Long> userIds;

    private Long createdById;
}
