package co.icesi.TallerJPA.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import co.icesi.TallerJPA.model.Space;

@Repository
public interface SpaceRepository extends JpaRepository<Space, Long> {

}
