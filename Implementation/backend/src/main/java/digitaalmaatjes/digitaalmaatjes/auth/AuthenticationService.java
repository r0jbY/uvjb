package digitaalmaatjes.digitaalmaatjes.auth;

import digitaalmaatjes.digitaalmaatjes.config.JwtService;
import digitaalmaatjes.digitaalmaatjes.enums.Role;
import digitaalmaatjes.digitaalmaatjes.user.User;
import digitaalmaatjes.digitaalmaatjes.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER) // Assign default role as USER
                .build();
        repository.save(user);

        // Pass the role explicitly when generating the token
        var jwtToken = jwtService.generateToken(user, user.getRole().name());

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();

        // Pass the role explicitly when generating the token
        var jwtToken = jwtService.generateToken(user, user.getRole().name());

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
}
