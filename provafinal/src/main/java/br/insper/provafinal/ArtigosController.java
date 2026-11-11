package br.insper.provafinal;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/artigos")
public class ArtigosController {

    private final ArtigosService artigosService;

    @Value("${app.auth0.namespace}")
    private String namespace;

    public ArtigosController(ArtigosService artigosService) {
        this.artigosService = artigosService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Artigos cadastrar(@Valid @RequestBody Artigos artigo,
                             @AuthenticationPrincipal Jwt jwt) {
        String emailCriador = jwt.getClaimAsString(namespace + "email");
        return artigosService.createArtigos(artigo, emailCriador);
    }

    @GetMapping
    public List<Artigos> listar() {
        return artigosService.listArtigos();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id) {
        artigosService.deleteArtigos(id);
    }
}