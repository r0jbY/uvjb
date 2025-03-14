package digitaalmaatjes.digitaalmaatjes.user;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/users")
public class NonAuthUserController {

    private final INonAuthUserService userService;

    public NonAuthUserController(@Qualifier("NonAuthUserService") INonAuthUserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        User user = userService.getUserById(id);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateUser(@PathVariable Integer id, @RequestBody UserUpdateDTO userUpdateDTO) {
        boolean updated = userService.updateUser(id, userUpdateDTO);
        return updated ? ResponseEntity.ok("User updated successfully!")
                : ResponseEntity.status(400).body("Failed to update user.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Integer id) {
        boolean deleted = userService.deleteUser(id);
        return deleted ? ResponseEntity.ok("User deleted successfully!")
                : ResponseEntity.status(400).body("Failed to delete user.");
    }
}
