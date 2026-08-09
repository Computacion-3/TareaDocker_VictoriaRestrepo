package co.icesi.TallerJPA.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SpaceRequestDTO {

    @NotBlank
    private String name;

    @NotBlank
    private String type;

    @NotNull
    @JsonAlias("disponibility")
    private Boolean available;

    @NotNull
    private Integer capacity;
}
