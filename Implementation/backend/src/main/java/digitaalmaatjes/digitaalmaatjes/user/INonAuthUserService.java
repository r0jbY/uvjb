package digitaalmaatjes.digitaalmaatjes.user;

import java.util.List;

public interface INonAuthUserService {
    List<User> getAllUsers();
    User getUserById(Integer id);
    boolean updateUser(Integer id, UserUpdateDTO userUpdateDTO);
    boolean deleteUser(Integer id);
}
