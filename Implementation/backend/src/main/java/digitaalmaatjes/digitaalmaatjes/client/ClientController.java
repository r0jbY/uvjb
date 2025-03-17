package digitaalmaatjes.digitaalmaatjes.client;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/client")
public class ClientController {

    private final IClientService service;

    public ClientController(@Qualifier("ClientService") IClientService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Client>> allClients(Authentication token) {
        try {
            List<Client> clientList = service.allClients(token);
            return ResponseEntity.ok(clientList);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

    @GetMapping("{id}")
    public ResponseEntity<Client> client(@PathVariable int id) {
        Client client = service.selectClient(id);
        return (client != null) ? ResponseEntity.ok(client) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Integer> createClient(@RequestBody ClientDTO clientDTO) {
        int clientId = service.createClient(clientDTO);
        return (clientId > 0) ? ResponseEntity.ok(clientId) : ResponseEntity.status(HttpStatus.CONFLICT).body(clientId);
    }

    @PutMapping("{id}")
    public ResponseEntity<?> updateClient(@RequestBody ClientDTO clientDTO, @PathVariable int id) {
        boolean updated = service.updateClient(clientDTO, id);
        return updated ? ResponseEntity.noContent().build() : ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteClient(@PathVariable int id, Authentication token) {
        boolean deleted = service.deleteClient(id, token);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }
}
