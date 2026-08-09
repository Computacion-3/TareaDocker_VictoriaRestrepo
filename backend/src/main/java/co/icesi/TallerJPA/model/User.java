package co.icesi.TallerJPA.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private String password;
    private boolean active = true;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    @OneToMany(mappedBy = "owner")
    private List<Routine> ownedRoutines;

    @OneToMany(mappedBy = "createdBy")
    private List<Routine> createdRoutines;

    @OneToMany(mappedBy = "user")
    private List<Progress> progressRecords;

    @OneToMany(mappedBy = "user")
    private List<Notification> notifications;

    @ManyToMany(mappedBy = "users")
    private List<Event> events;

    @OneToMany(mappedBy = "trainer")
    private List<TrainerAssignment> trainerAssignments;

    @OneToMany(mappedBy = "assignedUser")
    private List<TrainerAssignment> userAssignments;

    @OneToMany(mappedBy = "trainer")
    private List<Recommendation> sentRecommendations;

    @OneToMany(mappedBy = "targetUser")
    private List<Recommendation> receivedRecommendations;

    @OneToMany(mappedBy = "createdBy")
    private List<Exercise> createdExercises;

    @PrePersist
    void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

}
