package digitaalmaatjes.digitaalmaatjes.auth;

import digitaalmaatjes.digitaalmaatjes.config.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/token") // Update the base path for this controller
public class AuthController {

    @Autowired
    private JwtService jwtService;

    @GetMapping("/device-token")
    public String generateDeviceToken(@AuthenticationPrincipal UserDetails userDetails) {
        // Generate the permanent token
        return jwtService.generatePermanentToken(userDetails, "ADMIN");
    }
}
