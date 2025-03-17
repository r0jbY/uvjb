package digitaalmaatjes.digitaalmaatjes.user;

import digitaalmaatjes.digitaalmaatjes.enums.Role;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service("UserService")
public class UserService implements IUserService{
    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    public List<User> allUsers(Authentication token) {
        return repo.findAll();
    }

    public User selectUser(int id, Authentication token) {
        User user = repo.findById(id).orElse(null);
        return user;
    }

    public User updateUser(UserDTO dto, Authentication token) {
        User user = dtoToUser(dto);
        return repo.save(user);
    }

    public User updateUserRole(int id, Authentication token) {
        User user = repo.findById(id).orElse(null);
        user.setRole(Role.ADMIN);
        return repo.save(user);
    }

    private User dtoToUser(UserDTO dto) {
        return User.builder().build();
    }
}
