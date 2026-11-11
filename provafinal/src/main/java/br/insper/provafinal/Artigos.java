package br.insper.provafinal;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Artigos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "título é obrigatório")
    private String titulo;

    @Size(max = 1000)
    @Column(length = 1000)
    private String descricao;

    private String emailCriador;

    @Min(value = 0, message = "prioridade mínima é 0")
    @Max(value = 10, message = "prioridade máxima é 10")
    private int prioridade;
}
