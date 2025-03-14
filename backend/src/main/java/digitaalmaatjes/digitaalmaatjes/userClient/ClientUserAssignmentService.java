package digitaalmaatjes.digitaalmaatjes.userClient;

import digitaalmaatjes.digitaalmaatjes.client.Client;
import digitaalmaatjes.digitaalmaatjes.client.ClientRepository;
import digitaalmaatjes.digitaalmaatjes.user.User;
import digitaalmaatjes.digitaalmaatjes.user.UserRepository;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

@Service("ClientUserAssignmentService")
public class ClientUserAssignmentService implements IClientUserAssignmentService {

    private final ClientRepository clientRepository;
    private final UserRepository userRepository;

    public ClientUserAssignmentService(ClientRepository clientRepository, UserRepository userRepository) {
        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
    }

    @Override
    public boolean assignUserToClient(Integer clientId, Integer userId) {
        Client client = clientRepository.findById(clientId).orElse(null);
        User user = userRepository.findById(userId).orElse(null);

        if (client != null && user != null) {
            client.getAssignedUsers().add(user);
            clientRepository.save(client);
            return true;
        }
        return false;
    }

    @Override
    public ClientUserResponse getAssignedUsers(Integer clientId) {
        Client client = clientRepository.findById(clientId).orElse(null);

        if (client != null) {
            ClientUserResponse response = new ClientUserResponse();
            response.setClientId(clientId);
            response.setAssignedUserIds(
                    client.getAssignedUsers().stream()
                            .map(User::getId)
                            .collect(Collectors.toList())
            );
            return response;
        }
        return null;
    }

    @Override
    public boolean removeUserFromClient(Integer clientId, Integer userId) {
        Client client = clientRepository.findById(clientId).orElse(null);
        User user = userRepository.findById(userId).orElse(null);

        if (client != null && user != null) {
            client.getAssignedUsers().remove(user);
            clientRepository.save(client);
            return true;
        }
        return false;
    }
}