package br.insper.provafinal;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class ArtigosService {
    private final ArtigosRepository artigosRepository;
    public ArtigosService(ArtigosRepository artigosRepository) {
        this.artigosRepository = artigosRepository;
    }

    public Artigos createArtigos(Artigos artigos, String emailCriador) {
        Artigos novo = new Artigos();
        novo.setTitulo(artigos.getTitulo());
        novo.setDescricao(artigos.getDescricao());
        novo.setPrioridade(artigos.getPrioridade());
        novo.setEmailCriador(emailCriador);
        return artigosRepository.save(novo);
    }

    public List<Artigos> listArtigos() {
        return artigosRepository.findAll();
    }

    public Artigos buscarPorId(Long id) {
        return artigosRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Artigo não encontrado"));
    }

    public void deleteArtigos(Long id) {
        artigosRepository.delete(buscarPorId(id));
    }
}
