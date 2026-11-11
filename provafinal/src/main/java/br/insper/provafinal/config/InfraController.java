package br.insper.provafinal.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class InfraController {

    @Value("${app.auth0.namespace}")
    private String namespace;

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }

    @GetMapping("/me")
    public Map<String, Object> me(@AuthenticationPrincipal Jwt jwt) {
        String email = jwt.getClaimAsString(namespace + "email");
        List<String> roles = jwt.getClaimAsStringList(namespace + "roles");
        return Map.of(
                "email", email == null ? "" : email,
                "roles", roles == null ? List.of() : roles
        );
    }
}