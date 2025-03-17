package digitaalmaatjes.digitaalmaatjes.user;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/user")
public class UserController {
    private final IUserService service;

    public UserController(@Qualifier("UserService") IUserService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<User>> allUsers(Authentication token) {
        List<User> userList = service.allUsers(token);
        return (userList != null) ? ResponseEntity.ok().body(userList) : ResponseEntity.notFound().build();
    }

    @GetMapping("{id}")
    public ResponseEntity<User> user(@PathVariable int id, Authentication token) {
        User user = service.selectUser(id, token);
        return (user != null) ? ResponseEntity.ok().body(user) : ResponseEntity.notFound().build();
    }

    @PutMapping
    public ResponseEntity<User> update(@RequestBody UserDTO dto, Authentication token){
        User user = service.updateUser(dto, token);
        return (user != null) ? ResponseEntity.ok().body(user) : ResponseEntity.notFound().build();
    }

    @PutMapping("{id}")
    public ResponseEntity<User> updateRole(@PathVariable int id, Authentication token){
        User user = service.updateUserRole(id, token);
        return (user != null) ? ResponseEntity.ok().body(user) : ResponseEntity.notFound().build();
    }
}
