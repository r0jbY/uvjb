package digitaalmaatjes.digitaalmaatjes.family;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/family")
public class FamilyController {

    private final IFamilyService service;

    public FamilyController(@Qualifier("FamilyService") IFamilyService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<String> addFamilyContact(@RequestBody FamilyDTO familyDTO) {
        boolean added = service.addFamilyContact(familyDTO);
        return added ? ResponseEntity.ok("Family contact added successfully!")
                : ResponseEntity.status(400).body("Failed to add family contact.");
    }

    @GetMapping("/{clientId}")
    public ResponseEntity<List<FamilyDTO>> getFamilyContacts(@PathVariable Integer clientId) {
        List<FamilyDTO> contacts = service.getFamilyContacts(clientId);
        return contacts != null ? ResponseEntity.ok(contacts) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFamilyContact(@PathVariable Integer id) {
        boolean deleted = service.deleteFamilyContact(id);
        return deleted ? ResponseEntity.ok("Family contact deleted successfully!")
                : ResponseEntity.status(400).body("Failed to delete family contact.");
    }
}
