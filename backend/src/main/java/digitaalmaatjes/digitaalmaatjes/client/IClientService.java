package digitaalmaatjes.digitaalmaatjes.client;

import org.springframework.security.core.Authentication;

import java.util.List;

public interface IClientService {
    public List<Client> allClients(Authentication token);
    public Client selectClient(int clientId);
    public int createClient(ClientDTO clientDTO);
    public boolean updateClient(ClientDTO clientDTO, int id);
    public boolean deleteClient(int clientId, Authentication token);
}