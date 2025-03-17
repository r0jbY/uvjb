package digitaalmaatjes.digitaalmaatjes.client;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository("ClientRepository")
public interface ClientRepository extends JpaRepository<Client, Integer> {
}
