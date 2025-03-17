package digitaalmaatjes.digitaalmaatjes.meeting;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MeetingRepository extends JpaRepository<Meeting, Integer> {
    List<Meeting> findByClientId(Integer clientId);
    List<Meeting> findByUserId(Integer userId);
}
