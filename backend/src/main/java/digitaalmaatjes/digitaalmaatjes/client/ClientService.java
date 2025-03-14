package digitaalmaatjes.digitaalmaatjes.client;

import digitaalmaatjes.digitaalmaatjes.enums.Role;
import digitaalmaatjes.digitaalmaatjes.user.UserRepository;
import digitaalmaatjes.digitaalmaatjes.validation.Validate;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service("ClientService")
public class ClientService implements IClientService {

    private final ClientRepository repository;
    private final Validate validate;
    private final UserRepository userRepository;

    public ClientService(@Qualifier("ClientRepository") ClientRepository repository,
                         @Qualifier("Validate") Validate validate,
                         @Qualifier("UserRepository") UserRepository userRepository) {
        this.repository = repository;
        this.validate = validate;
        this.userRepository = userRepository;
    }

    @Override
    public List<Client> allClients(Authentication token) {
        if (token.isAuthenticated() &&
                token.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            return repository.findAll();
        }
        throw new AccessDeniedException("Access Denied: Only admins can view all clients.");
    }

    @Override
    public Client selectClient(int clientId) {
        return repository.findById(clientId).orElse(null);
    }

    @Override
    public int createClient(ClientDTO clientDTO) {
        if (!validate.client(clientDTO)) {
            return 0;
        }
        Client client = dtoToClient(clientDTO);
        return repository.save(client).getId();
    }

    private Client dtoToClient(ClientDTO dto) {
        return new Client(dto.getFirstname(), dto.getLastname(), dto.getAdress(), dto.getDevicecode(), dto.isActive());
    }

    @Override
    public boolean updateClient(ClientDTO clientDTO, int id) {
        if (!validate.client(clientDTO)) {
            return false;
        }
        Client existingClient = selectClient(id);
        if (existingClient == null) {
            return false;
        }
        existingClient.setFirstname(clientDTO.getFirstname());
        existingClient.setLastname(clientDTO.getLastname());
        existingClient.setAdress(clientDTO.getAdress());
        existingClient.setDevicecode(clientDTO.getDevicecode());
        existingClient.setActive(clientDTO.isActive());
        repository.save(existingClient);
        return true;
    }

    @Override
    public boolean deleteClient(int clientId, Authentication token) {
        Client client = selectClient(clientId);
        if (client == null) {
            return false;
        }
        if (token.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            repository.delete(client);
            return true;
        }
        return false;
    }
}
