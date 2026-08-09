package co.icesi.TallerJPA.services;

import co.icesi.TallerJPA.dto.request.SpaceRequestDTO;
import co.icesi.TallerJPA.exception.ResourceNotFoundException;
import co.icesi.TallerJPA.model.Space;
import co.icesi.TallerJPA.repository.SpaceRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SpaceService {

    private final SpaceRepository spaceRepository;

    public SpaceService(SpaceRepository spaceRepository) {
        this.spaceRepository = spaceRepository;
    }

    public List<Space> findAll() {
        return spaceRepository.findAll();
    }

    public Space findById(Long id) {
        return spaceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Space not found"));
    }

    public Space save(SpaceRequestDTO dto) {

        Space space = new Space();

        applyDto(space, dto);

        return spaceRepository.save(space);
    }

    public Space update(Long id, SpaceRequestDTO dto) {

        Space space = findById(id);

        applyDto(space, dto);

        return spaceRepository.save(space);
    }

    public void delete(Long id) {

        Space space = findById(id);

        spaceRepository.delete(space);
    }

    private void applyDto(Space space, SpaceRequestDTO dto) {
        space.setName(dto.getName());
        space.setType(dto.getType());
        space.setDescription(dto.getDescription());
        space.setLocation(dto.getLocation());
        space.setAvailable(dto.isAvailable());
        space.setCapacity(dto.getCapacity());
        space.setOpeningHours(dto.getOpeningHours());
        space.setClosingHours(dto.getClosingHours());
    }
}
