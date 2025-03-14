package digitaalmaatjes.digitaalmaatjes.user;

import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Optional;

public interface IUserService {
    List<User> allUsers(Authentication token);

    User selectUser(int id, Authentication token);

    User updateUser(UserDTO dto, Authentication token);

    User updateUserRole(int id, Authentication token);
}
