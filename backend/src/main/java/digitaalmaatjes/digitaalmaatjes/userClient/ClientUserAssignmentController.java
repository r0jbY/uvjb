package digitaalmaatjes.digitaalmaatjes.userClient;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/assignments")
public class ClientUserAssignmentController {

    private final IClientUserAssignmentService service;

    public ClientUserAssignmentController(@Qualifier("ClientUserAssignmentService") IClientUserAssignmentService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<String> assignUserToClient(@RequestBody AssignUserToClientRequest request) {
        boolean isAssigned = service.assignUserToClient(request.getClientId(), request.getUserId());
        return isAssigned ? ResponseEntity.ok("User assigned to client successfully!")
                : ResponseEntity.status(400).body("Failed to assign user to client.");
    }

    @GetMapping("/{clientId}")
    public ResponseEntity<ClientUserResponse> getAssignedUsers(@PathVariable Integer clientId) {
        ClientUserResponse response = service.getAssignedUsers(clientId);
        return response != null ? ResponseEntity.ok(response) : ResponseEntity.notFound().build();
    }

    @DeleteMapping
    public ResponseEntity<String> removeUserFromClient(@RequestBody AssignUserToClientRequest request) {
        boolean isRemoved = service.removeUserFromClient(request.getClientId(), request.getUserId());
        return isRemoved ? ResponseEntity.ok("User removed from client successfully!")
                : ResponseEntity.status(400).body("Failed to remove user from client.");
    }
}
