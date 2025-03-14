package digitaalmaatjes.digitaalmaatjes.user;

import digitaalmaatjes.digitaalmaatjes.enums.Role;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("NonAuthUserService")
public class NonAuthUserService implements INonAuthUserService {

    private final UserRepository userRepository;

    public NonAuthUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Integer id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public boolean updateUser(Integer id, UserUpdateDTO userUpdateDTO) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return false;

        // Update fields
        if (userUpdateDTO.getFirstname() != null) user.setFirstname(userUpdateDTO.getFirstname());
        if (userUpdateDTO.getLastname() != null) user.setLastname(userUpdateDTO.getLastname());
        if (userUpdateDTO.getEmail() != null) user.setEmail(userUpdateDTO.getEmail());
        if (userUpdateDTO.getPassword() != null) user.setPassword(userUpdateDTO.getPassword());
        if (userUpdateDTO.getAdress() != null) user.setAdress(userUpdateDTO.getAdress());
        if (userUpdateDTO.getPhonenumber() != null) user.setPhonenumber(userUpdateDTO.getPhonenumber());
        user.setActive(userUpdateDTO.isActive());

        if (userUpdateDTO.getRole() != null) {
            try {
                user.setRole(Role.valueOf(userUpdateDTO.getRole().toUpperCase()));
            } catch (IllegalArgumentException e) {
                return false; // Invalid role provided
            }
        }

        userRepository.save(user);
        return true;
    }

    @Override
    public boolean deleteUser(Integer id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
