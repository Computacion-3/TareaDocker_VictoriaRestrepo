package co.icesi.TallerJPA.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "recommendations")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "trainer_id")
    private User trainer;

    @ManyToOne
    @JoinColumn(name = "target_user_id")
    private User targetUser;

    private String title;
    private String message;
    private LocalDateTime createdAt;
    private boolean read;

    @ManyToOne
    @JoinColumn(name = "related_progress_id")
    private Progress relatedProgress;

    @ManyToOne
    @JoinColumn(name = "related_routine_id")
    private Routine relatedRoutine;

    @PrePersist
    void prePersist() {
        createdAt = LocalDateTime.now();
    }
}
