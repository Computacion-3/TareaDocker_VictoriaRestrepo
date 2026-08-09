package co.icesi.TallerJPA.services;

import co.icesi.TallerJPA.dto.request.EventRequestDTO;
import co.icesi.TallerJPA.exception.ResourceNotFoundException;
import co.icesi.TallerJPA.model.Event;
import co.icesi.TallerJPA.model.Space;
import co.icesi.TallerJPA.model.User;
import co.icesi.TallerJPA.repository.EventRepository;
import co.icesi.TallerJPA.repository.SpaceRepository;
import co.icesi.TallerJPA.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final SpaceRepository spaceRepository;
    private final UserRepository userRepository;

    public EventService(
            EventRepository eventRepository,
            SpaceRepository spaceRepository,
            UserRepository userRepository
    ) {
        this.eventRepository = eventRepository;
        this.spaceRepository = spaceRepository;
        this.userRepository = userRepository;
    }

    public List<Event> findAll() {
        return eventRepository.findAll();
    }

    public Event findById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Event not found"));
    }

    public List<Event> findUpcoming() {
        return eventRepository.findByDateTimeAfterOrderByDateTimeAsc(LocalDateTime.now());
    }

    public List<Event> findBySpace(Long spaceId) {
        return eventRepository.findBySpacesId(spaceId);
    }

    public Event save(EventRequestDTO dto) {

        Event event = new Event();

        applyDto(event, dto);

        return eventRepository.save(event);
    }

    public Event update(Long id, EventRequestDTO dto) {

        Event event = findById(id);

        applyDto(event, dto);

        return eventRepository.save(event);
    }

    public void delete(Long id) {

        Event event = findById(id);

        eventRepository.delete(event);
    }

    private void applyDto(Event event, EventRequestDTO dto) {
        List<Long> spaceIds = dto.getSpaceIds() == null ? List.of() : dto.getSpaceIds();
        List<Space> spaces = spaceRepository.findAllById(spaceIds);
        if (spaces.size() != spaceIds.size()) {
            throw new ResourceNotFoundException("One or more spaces not found");
        }

        List<Long> userIds = dto.getUserIds() == null ? List.of() : dto.getUserIds();
        List<User> users = userRepository.findAllById(userIds);
        if (users.size() != userIds.size()) {
            throw new ResourceNotFoundException("One or more users not found");
        }

        User createdBy = null;
        if (dto.getCreatedById() != null) {
            createdBy = userRepository.findById(dto.getCreatedById())
                    .orElseThrow(() -> new ResourceNotFoundException("Creator user not found"));
        }

        event.setName(dto.getName());
        event.setDescription(dto.getDescription());
        event.setEventType(dto.getEventType());
        event.setDateTime(dto.getDateTime());
        event.setEndDateTime(dto.getEndDateTime());
        event.setCapacity(dto.getCapacity());
        event.setLocation(dto.getLocation());
        event.setSpaces(spaces);
        event.setUsers(users);
        event.setCreatedBy(createdBy);
    }
}
