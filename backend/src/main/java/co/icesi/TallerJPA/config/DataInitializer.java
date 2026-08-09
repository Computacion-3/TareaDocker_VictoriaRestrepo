package co.icesi.TallerJPA.config;

import co.icesi.TallerJPA.model.Event;
import co.icesi.TallerJPA.model.Exercise;
import co.icesi.TallerJPA.model.Notification;
import co.icesi.TallerJPA.model.Permission;
import co.icesi.TallerJPA.model.Progress;
import co.icesi.TallerJPA.model.Recommendation;
import co.icesi.TallerJPA.model.Role;
import co.icesi.TallerJPA.model.Routine;
import co.icesi.TallerJPA.model.RoutineExercise;
import co.icesi.TallerJPA.model.Space;
import co.icesi.TallerJPA.model.TrainerAssignment;
import co.icesi.TallerJPA.model.User;
import co.icesi.TallerJPA.repository.EventRepository;
import co.icesi.TallerJPA.repository.ExerciseRepository;
import co.icesi.TallerJPA.repository.NotificationRepository;
import co.icesi.TallerJPA.repository.PermissionRepository;
import co.icesi.TallerJPA.repository.ProgressRepository;
import co.icesi.TallerJPA.repository.RecommendationRepository;
import co.icesi.TallerJPA.repository.RoleRepository;
import co.icesi.TallerJPA.repository.RoutineRepository;
import co.icesi.TallerJPA.repository.SpaceRepository;
import co.icesi.TallerJPA.repository.TrainerAssignmentRepository;
import co.icesi.TallerJPA.repository.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(
            RoleRepository roleRepo,
            PermissionRepository permissionRepo,
            UserRepository userRepo,
            ExerciseRepository exerciseRepo,
            SpaceRepository spaceRepo,
            EventRepository eventRepo,
            RoutineRepository routineRepo,
            ProgressRepository progressRepo,
            TrainerAssignmentRepository assignmentRepo,
            RecommendationRepository recommendationRepo,
            NotificationRepository notificationRepo,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            Permission read = findOrCreatePermission(permissionRepo, "READ_PRIVILEGE", "Permite ver registros");
            Permission write = findOrCreatePermission(permissionRepo, "WRITE_PRIVILEGE", "Permite crear y editar");

            Role adminRole = findOrCreateRole(roleRepo, "ADMIN", "Administrador del sistema", Set.of(read, write));
            Role trainerRole = findOrCreateRole(roleRepo, "TRAINER", "Entrenador certificado", Set.of(read, write));
            Role userRole = findOrCreateRole(roleRepo, "USER", "Usuario normal de la aplicacion", Set.of(read));

            User admin = findOrCreateUser(userRepo, passwordEncoder, "Administrador Icesi", "admin@icesi.edu.co", "admin123", adminRole);
            User trainer1 = findOrCreateUser(userRepo, passwordEncoder, "Entrenadora Ana", "trainer1@icesi.edu.co", "trainer123", trainerRole);
            User trainer2 = findOrCreateUser(userRepo, passwordEncoder, "Entrenador Carlos", "trainer2@icesi.edu.co", "trainer123", trainerRole);

            List<User> users = List.of(
                    findOrCreateUser(userRepo, passwordEncoder, "Usuario Uno", "user1@icesi.edu.co", "user123", userRole),
                    findOrCreateUser(userRepo, passwordEncoder, "Usuario Dos", "user2@icesi.edu.co", "user123", userRole),
                    findOrCreateUser(userRepo, passwordEncoder, "Usuario Tres", "user3@icesi.edu.co", "user123", userRole),
                    findOrCreateUser(userRepo, passwordEncoder, "Usuario Cuatro", "user4@icesi.edu.co", "user123", userRole),
                    findOrCreateUser(userRepo, passwordEncoder, "Usuario Cinco", "user5@icesi.edu.co", "user123", userRole),
                    findOrCreateUser(userRepo, passwordEncoder, "Usuario Seis", "user6@icesi.edu.co", "user123", userRole)
            );

            List<Exercise> globalExercises = seedGlobalExercises(exerciseRepo);
            seedCustomExercises(exerciseRepo, users);
            List<Space> spaces = seedSpaces(spaceRepo);
            seedEvents(eventRepo, spaces, admin, trainer1, trainer2);
            List<Routine> templates = seedTemplates(routineRepo, globalExercises, trainer1, trainer2);
            List<Routine> personalRoutines = seedPersonalRoutines(routineRepo, globalExercises, users);
            seedAssignments(assignmentRepo, trainer1, trainer2, users);
            seedProgress(progressRepo, users, personalRoutines);
            seedRecommendations(recommendationRepo, progressRepo, trainer1, trainer2, users, templates, personalRoutines);
            seedNotifications(notificationRepo, users, templates);
        };
    }

    private Permission findOrCreatePermission(PermissionRepository repository, String name, String description) {
        return repository.findByName(name).orElseGet(() -> {
            Permission permission = new Permission();
            permission.setName(name);
            permission.setDescription(description);
            return repository.save(permission);
        });
    }

    private Role findOrCreateRole(RoleRepository repository, String name, String description, Set<Permission> permissions) {
        return repository.findByName(name).orElseGet(() -> {
            Role role = new Role();
            role.setName(name);
            role.setDescription(description);
            role.setPermissions(permissions);
            return repository.save(role);
        });
    }

    private User findOrCreateUser(
            UserRepository repository,
            PasswordEncoder passwordEncoder,
            String name,
            String email,
            String password,
            Role role
    ) {
        return repository.findByEmail(email).orElseGet(() -> {
            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(role);
            user.setActive(true);
            return repository.save(user);
        });
    }

    private List<Exercise> seedGlobalExercises(ExerciseRepository repository) {
        List<ExerciseSeed> seeds = List.of(
                new ExerciseSeed("Caminata rapida", "CARDIO", "Caminata activa para activar el sistema cardiovascular.", 30, "EASY"),
                new ExerciseSeed("Trote suave", "CARDIO", "Trote continuo a intensidad baja o media.", 25, "MEDIUM"),
                new ExerciseSeed("Bicicleta estatica", "CARDIO", "Trabajo cardiovascular controlado en bicicleta.", 35, "MEDIUM"),
                new ExerciseSeed("Saltar la cuerda", "CARDIO", "Intervalos cortos de salto para resistencia.", 15, "MEDIUM"),
                new ExerciseSeed("Eliptica", "CARDIO", "Cardio de bajo impacto para todo el cuerpo.", 30, "EASY"),
                new ExerciseSeed("Circuito cardiovascular", "CARDIO", "Secuencia de ejercicios aerobicos por estaciones.", 25, "HARD"),
                new ExerciseSeed("Sentadilla", "STRENGTH", "Ejercicio basico de fuerza para piernas.", 12, "MEDIUM"),
                new ExerciseSeed("Flexiones", "STRENGTH", "Empuje con peso corporal para pecho y brazos.", 10, "MEDIUM"),
                new ExerciseSeed("Plancha", "STRENGTH", "Trabajo isometrico para core.", 8, "EASY"),
                new ExerciseSeed("Peso muerto con mancuerna", "STRENGTH", "Patron de bisagra para cadena posterior.", 12, "HARD"),
                new ExerciseSeed("Zancadas", "STRENGTH", "Trabajo unilateral de piernas.", 12, "MEDIUM"),
                new ExerciseSeed("Abdominales", "STRENGTH", "Fortalecimiento de core.", 10, "EASY"),
                new ExerciseSeed("Remo con banda", "STRENGTH", "Traccion para espalda con banda elastica.", 12, "MEDIUM"),
                new ExerciseSeed("Press de hombro", "STRENGTH", "Empuje vertical con mancuernas.", 12, "MEDIUM"),
                new ExerciseSeed("Estiramiento de espalda", "MOBILITY", "Movilidad y liberacion de espalda.", 12, "EASY"),
                new ExerciseSeed("Movilidad de hombros", "MOBILITY", "Rangos controlados para hombros.", 10, "EASY"),
                new ExerciseSeed("Estiramiento de piernas", "MOBILITY", "Flexibilidad de cuadriceps e isquiotibiales.", 12, "EASY"),
                new ExerciseSeed("Movilidad de cadera", "MOBILITY", "Activacion y movilidad de cadera.", 10, "MEDIUM"),
                new ExerciseSeed("Yoga basico", "MOBILITY", "Secuencia simple de posturas.", 30, "EASY"),
                new ExerciseSeed("Respiracion y relajacion", "MOBILITY", "Tecnicas de respiracion y vuelta a la calma.", 8, "EASY")
        );

        List<Exercise> exercises = new ArrayList<>();
        for (ExerciseSeed seed : seeds) {
            exercises.add(findOrCreateExercise(repository, seed, false, null));
        }
        return exercises;
    }

    private void seedCustomExercises(ExerciseRepository repository, List<User> users) {
        findOrCreateExercise(repository, new ExerciseSeed("Circuito personal de abdomen", "STRENGTH", "Circuito creado para fortalecer core.", 18, "MEDIUM"), true, users.get(0));
        findOrCreateExercise(repository, new ExerciseSeed("Movilidad suave de rodilla", "MOBILITY", "Rutina personalizada de movilidad de rodilla.", 12, "EASY"), true, users.get(1));
        findOrCreateExercise(repository, new ExerciseSeed("Cardio escaleras campus", "CARDIO", "Subidas controladas en escaleras del campus.", 20, "HARD"), true, users.get(2));
    }

    private Exercise findOrCreateExercise(ExerciseRepository repository, ExerciseSeed seed, boolean custom, User createdBy) {
        Optional<Exercise> existing = repository.findAll().stream()
                .filter(exercise -> exercise.getName().equals(seed.name()))
                .filter(exercise -> exercise.isCustom() == custom)
                .filter(exercise -> createdBy == null
                        ? exercise.getCreatedBy() == null
                        : exercise.getCreatedBy() != null && exercise.getCreatedBy().getId().equals(createdBy.getId()))
                .findFirst();
        if (existing.isPresent()) {
            return existing.get();
        }

        Exercise exercise = new Exercise();
        exercise.setName(seed.name());
        exercise.setType(seed.type());
        exercise.setDescription(seed.description());
        exercise.setDuration(seed.duration());
        exercise.setDifficulty(seed.difficulty());
        exercise.setVideoUrl("https://videos.icesi.edu.co/actividad-fisica/" + slug(seed.name()));
        exercise.setActive(true);
        exercise.setCustom(custom);
        exercise.setCreatedBy(createdBy);
        return repository.save(exercise);
    }

    private List<Space> seedSpaces(SpaceRepository repository) {
        List<SpaceSeed> seeds = List.of(
                new SpaceSeed("Gimnasio principal", "GYM", "Zona de fuerza y maquinas.", "Centro deportivo", 80),
                new SpaceSeed("Cancha multiple", "COURT", "Cancha para futbol sala, voleibol y baloncesto.", "Bloque deportivo", 40),
                new SpaceSeed("Salon de yoga", "ROOM", "Salon tranquilo para movilidad y yoga.", "Edificio bienestar", 25),
                new SpaceSeed("Zona funcional", "FUNCTIONAL", "Area para circuitos funcionales.", "Gimnasio principal", 30),
                new SpaceSeed("Pista atletica", "TRACK", "Pista para caminata y trote.", "Exterior campus", 120),
                new SpaceSeed("Piscina semiolimpica", "POOL", "Piscina para natacion recreativa.", "Complejo acuatico", 60)
        );
        List<Space> spaces = new ArrayList<>();
        for (SpaceSeed seed : seeds) {
            spaces.add(findOrCreateSpace(repository, seed));
        }
        return spaces;
    }

    private Space findOrCreateSpace(SpaceRepository repository, SpaceSeed seed) {
        return repository.findAll().stream()
                .filter(space -> space.getName().equals(seed.name()))
                .findFirst()
                .orElseGet(() -> {
                    Space space = new Space();
                    space.setName(seed.name());
                    space.setType(seed.type());
                    space.setDescription(seed.description());
                    space.setLocation(seed.location());
                    space.setCapacity(seed.capacity());
                    space.setAvailable(true);
                    space.setOpeningHours("06:00");
                    space.setClosingHours("20:00");
                    space.setActive(true);
                    return repository.save(space);
                });
    }

    private void seedEvents(EventRepository repository, List<Space> spaces, User admin, User trainer1, User trainer2) {
        if (repository.count() > 0) {
            return;
        }
        List<EventSeed> seeds = List.of(
                new EventSeed("Clase de yoga", "WELLNESS", 2, spaces.get(2), trainer1),
                new EventSeed("Torneo relampago de futbol", "SPORTS", 4, spaces.get(1), admin),
                new EventSeed("Entrenamiento funcional", "TRAINING", 5, spaces.get(3), trainer2),
                new EventSeed("Caminata saludable", "CARDIO", 7, spaces.get(4), trainer1),
                new EventSeed("Taller de movilidad", "MOBILITY", 9, spaces.get(2), trainer2),
                new EventSeed("Clase de spinning", "CARDIO", 11, spaces.get(0), trainer1),
                new EventSeed("Reto de plancha", "STRENGTH", 13, spaces.get(3), trainer2),
                new EventSeed("Charla de habitos saludables", "WELLNESS", 15, spaces.get(2), admin),
                new EventSeed("Torneo de baloncesto", "SPORTS", 18, spaces.get(1), admin),
                new EventSeed("Sesion de estiramiento", "MOBILITY", 20, spaces.get(2), trainer1)
        );

        for (EventSeed seed : seeds) {
            Event event = new Event();
            event.setName(seed.name());
            event.setDescription("Evento de bienestar: " + seed.name());
            event.setEventType(seed.type());
            event.setDateTime(LocalDateTime.now().plusDays(seed.daysFromNow()).withHour(17).withMinute(0).withSecond(0).withNano(0));
            event.setEndDateTime(event.getDateTime().plusHours(2));
            event.setCapacity(seed.space().getCapacity());
            event.setLocation(seed.space().getLocation());
            event.setSpaces(List.of(seed.space()));
            event.setCreatedBy(seed.createdBy());
            event.setActive(true);
            repository.save(event);
        }
    }

    private List<Routine> seedTemplates(RoutineRepository repository, List<Exercise> exercises, User trainer1, User trainer2) {
        List<Routine> templates = new ArrayList<>();
        if (repository.findByPredefinedTrue().isEmpty()) {
            templates.add(createRoutine(repository, "Rutina fuerza inicial", "Fuerza basica para principiantes.", null, trainer1, true, List.of(exercises.get(6), exercises.get(7), exercises.get(8))));
            templates.add(createRoutine(repository, "Cardio para principiantes", "Cardio suave para iniciar habito.", null, trainer1, true, List.of(exercises.get(0), exercises.get(1), exercises.get(4))));
            templates.add(createRoutine(repository, "Movilidad de espalda", "Movilidad y cuidado de espalda.", null, trainer2, true, List.of(exercises.get(14), exercises.get(15), exercises.get(18))));
            templates.add(createRoutine(repository, "Full body intermedio", "Rutina completa de fuerza.", null, trainer2, true, List.of(exercises.get(6), exercises.get(9), exercises.get(12), exercises.get(13))));
            templates.add(createRoutine(repository, "Resistencia cardiovascular", "Bloque de cardio progresivo.", null, trainer1, true, List.of(exercises.get(1), exercises.get(2), exercises.get(5))));
            templates.add(createRoutine(repository, "Rutina express de 20 minutos", "Sesion rapida para dias ocupados.", null, trainer2, true, List.of(exercises.get(7), exercises.get(10), exercises.get(11))));
        }
        templates.addAll(repository.findByPredefinedTrue());
        return templates;
    }

    private List<Routine> seedPersonalRoutines(RoutineRepository repository, List<Exercise> exercises, List<User> users) {
        List<Routine> routines = new ArrayList<>();
        for (int i = 0; i < users.size(); i++) {
            User user = users.get(i);
            List<Routine> existing = repository.findByOwnerId(user.getId());
            if (existing.size() >= 2) {
                routines.addAll(existing);
                continue;
            }
            routines.add(createRoutine(repository, "Plan semanal " + user.getName(), "Rutina personal de fuerza y movilidad.", user, user, false,
                    List.of(exercises.get((6 + i) % exercises.size()), exercises.get((10 + i) % exercises.size()), exercises.get((14 + i) % exercises.size()))));
            routines.add(createRoutine(repository, "Cardio campus " + user.getName(), "Rutina personal de resistencia.", user, user, false,
                    List.of(exercises.get(i % 6), exercises.get((2 + i) % 6), exercises.get((4 + i) % 6))));
        }
        return routines;
    }

    private Routine createRoutine(
            RoutineRepository repository,
            String name,
            String description,
            User owner,
            User createdBy,
            boolean predefined,
            List<Exercise> exercises
    ) {
        Routine routine = new Routine();
        routine.setName(name);
        routine.setDescription(description);
        routine.setOwner(owner);
        routine.setCreatedBy(createdBy);
        routine.setPredefined(predefined);
        routine.setActive(true);

        List<RoutineExercise> routineExercises = new ArrayList<>();
        for (int i = 0; i < exercises.size(); i++) {
            RoutineExercise routineExercise = new RoutineExercise();
            routineExercise.setRoutine(routine);
            routineExercise.setExercise(exercises.get(i));
            routineExercise.setSets(predefined ? 3 : 2 + (i % 2));
            routineExercise.setRepetitions(10 + (i * 2));
            routineExercise.setDuration(exercises.get(i).getDuration());
            routineExercise.setOrderIndex(i + 1);
            routineExercise.setNotes("Ejecutar con tecnica controlada.");
            routineExercises.add(routineExercise);
        }
        routine.setRoutineExercises(routineExercises);
        return repository.save(routine);
    }

    private void seedAssignments(TrainerAssignmentRepository repository, User trainer1, User trainer2, List<User> users) {
        assignIfMissing(repository, trainer1, users.get(0));
        assignIfMissing(repository, trainer1, users.get(1));
        assignIfMissing(repository, trainer1, users.get(2));
        assignIfMissing(repository, trainer2, users.get(3));
        assignIfMissing(repository, trainer2, users.get(4));
        assignIfMissing(repository, trainer2, users.get(5));
    }

    private void assignIfMissing(TrainerAssignmentRepository repository, User trainer, User user) {
        if (repository.existsByTrainerIdAndAssignedUserIdAndActiveTrue(trainer.getId(), user.getId())) {
            return;
        }
        TrainerAssignment assignment = new TrainerAssignment();
        assignment.setTrainer(trainer);
        assignment.setAssignedUser(user);
        assignment.setActive(true);
        repository.save(assignment);
    }

    private void seedProgress(ProgressRepository repository, List<User> users, List<Routine> routines) {
        if (repository.count() > 0) {
            return;
        }
        for (User user : users) {
            List<Routine> userRoutines = routines.stream()
                    .filter(routine -> routine.getOwner() != null && routine.getOwner().getId().equals(user.getId()))
                    .filter(routine -> routine.getRoutineExercises() != null && !routine.getRoutineExercises().isEmpty())
                    .toList();
            if (userRoutines.isEmpty()) {
                continue;
            }
            for (int i = 0; i < 10; i++) {
                Routine routine = userRoutines.get(i % userRoutines.size());
                RoutineExercise routineExercise = routine.getRoutineExercises().get(i % routine.getRoutineExercises().size());
                Progress progress = new Progress();
                progress.setUser(user);
                progress.setRoutine(routine);
                progress.setExercise(routineExercise.getExercise());
                progress.setDate(LocalDate.now().minusDays(i * 3L));
                progress.setPeriodType(i % 2 == 0 ? "DAILY" : "WEEKLY");
                progress.setRepetitions(routineExercise.getExercise().getType().equals("CARDIO") ? 0 : 20 + (i * 2));
                progress.setTimeMinutes(18 + (i * 3));
                progress.setEffortLevel(String.valueOf(2 + (i % 3)));
                progress.setWeight(routineExercise.getExercise().getType().equals("STRENGTH") ? BigDecimal.valueOf(8 + i) : null);
                progress.setNotes("Registro demo de avance " + (i + 1));
                repository.save(progress);
            }
        }
    }

    private void seedRecommendations(
            RecommendationRepository repository,
            ProgressRepository progressRepository,
            User trainer1,
            User trainer2,
            List<User> users,
            List<Routine> templates,
            List<Routine> routines
    ) {
        if (repository.count() > 0) {
            return;
        }
        for (int i = 0; i < users.size(); i++) {
            User user = users.get(i);
            User trainer = i < 3 ? trainer1 : trainer2;
            List<Progress> progressRecords = progressRepository.findByUserIdOrderByDateDesc(user.getId());
            Routine userRoutine = routines.stream()
                    .filter(routine -> routine.getOwner() != null && routine.getOwner().getId().equals(user.getId()))
                    .findFirst()
                    .orElse(null);

            createRecommendation(repository, trainer, user, "Ajuste de intensidad",
                    "Mantener tecnica y subir intensidad progresivamente esta semana.",
                    progressRecords.isEmpty() ? null : progressRecords.get(0), userRoutine);
            createRecommendation(repository, trainer, user, "Template sugerido",
                    "Probar una rutina predisenada para variar el estimulo de entrenamiento.",
                    progressRecords.size() > 1 ? progressRecords.get(1) : null, templates.get(i % templates.size()));
        }
    }

    private void createRecommendation(
            RecommendationRepository repository,
            User trainer,
            User target,
            String title,
            String message,
            Progress progress,
            Routine routine
    ) {
        Recommendation recommendation = new Recommendation();
        recommendation.setTrainer(trainer);
        recommendation.setTargetUser(target);
        recommendation.setTitle(title);
        recommendation.setMessage(message);
        recommendation.setRead(false);
        recommendation.setRelatedProgress(progress);
        recommendation.setRelatedRoutine(routine);
        repository.save(recommendation);
    }

    private void seedNotifications(NotificationRepository repository, List<User> users, List<Routine> templates) {
        if (repository.count() > 0) {
            return;
        }
        for (int i = 0; i < users.size(); i++) {
            createNotification(repository, users.get(i), "Nueva recomendacion recibida", "Tu entrenador dejo una recomendacion para revisar.", "RECOMMENDATION", null, false);
            createNotification(repository, users.get(i), "Evento disponible", "Hay una nueva actividad de bienestar en el campus.", "EVENT", null, i % 2 == 0);
            createNotification(repository, users.get(i), "Rutina predisenada sugerida", "Puedes adoptar una rutina recomendada.", "ROUTINE", templates.get(i % templates.size()).getId(), false);
            createNotification(repository, users.get(i), "Recordatorio semanal", "Registra tu progreso para mantener tus estadisticas actualizadas.", "PROGRESS", null, false);
        }
    }

    private void createNotification(
            NotificationRepository repository,
            User user,
            String title,
            String message,
            String type,
            Long relatedEntityId,
            boolean read
    ) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRelatedEntityId(relatedEntityId);
        notification.setRead(read);
        repository.save(notification);
    }

    private String slug(String text) {
        return text.toLowerCase().replace(" ", "-");
    }

    private record ExerciseSeed(String name, String type, String description, Integer duration, String difficulty) {
    }

    private record SpaceSeed(String name, String type, String description, String location, int capacity) {
    }

    private record EventSeed(String name, String type, int daysFromNow, Space space, User createdBy) {
    }
}
