package co.icesi.TallerJPA.dto;

import lombok.Data;

@Data
public class SpaceResponseDTO {

    private Long id;
    private String name;
    private String type;
    private Boolean available;
    private Integer capacity;
}
