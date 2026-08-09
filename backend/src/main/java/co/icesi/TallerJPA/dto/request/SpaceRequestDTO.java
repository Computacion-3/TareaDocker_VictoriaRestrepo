package co.icesi.TallerJPA.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class SpaceRequestDTO {

    @NotBlank
    private String name;

    @NotBlank
    private String type;

    private String description;

    private String location;

    @JsonAlias("disponibility")
    private boolean available;

    @Positive
    private int capacity;

    private String openingHours;

    private String closingHours;
}
