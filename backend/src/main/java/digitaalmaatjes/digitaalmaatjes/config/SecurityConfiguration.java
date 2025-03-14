package digitaalmaatjes.digitaalmaatjes.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    private static final String[] AUTH_WHITELIST = {
            // Public endpoints for authentication
            "/api/auth/**",

            // Swagger UI and API documentation
            "/swagger-resources/**",
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/v3/api-docs.yaml",
            "/swagger-ui.html",
            "/webjars/**",
            "/api/demo"
    };

    private static final String[] PROTECTED_ENDPOINTS = {
            "/api/user/**",
            "/api/users/**",
            "/api/client/**",
            "/api/family/**",
            "/api/meeting/**",
            "/api/assignments/**",
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(withDefaults()) // Enable CORS using the defined configuration
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("*").permitAll()
                        // Allow requests to whitelisted paths
                        .requestMatchers(AUTH_WHITELIST).permitAll()
                        // Restrict device token endpoint
                        .requestMatchers("/api/token/device-token").hasRole("ADMIN") // Check ADMIN role
                        // Restrict protected endpoints
                        .requestMatchers(PROTECTED_ENDPOINTS).hasAnyRole("USER", "ADMIN", "DEVICE", "BUDDY", "SUPERBUDDY")
                        // All other requests must be authenticated
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Stateless session for APIs
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class); // Add JWT filter

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*")); // Allow all origins
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Add OPTIONS
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type")); // Allow required headers
        configuration.setAllowCredentials(true); // Allow credentials

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
