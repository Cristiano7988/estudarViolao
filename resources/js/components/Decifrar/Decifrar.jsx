import React, { Component } from "react";
import EscalaDiatonica from "../../dados/EscalaDiatonica";

class Decifrar extends Component {
    constructor(props) {
        super(props);
        this.escala = new EscalaDiatonica();
        this.escala.reordenarEscalaDiatonica(this.escala.geraNumeroAleatorio());
        this.barra =
            parseInt(this.state.subNivel[this.state.subNivel.length - 1] * 10) + "%";
    }

    state = {
        respondido: null,
        respostaCerta: null,
        mensagemErro: null,
        nivel: this.props.usuario.nivel,
        subNivel: this.props.usuario.sub_nivel,
        avatar: {
            nome: this.props.usuario.avatar_name
        }
    };

    atualizaNivel(formData, nivel, novoSubNivel, acertos, erros, token) {
        formData.append("id", this.props.usuario.id);
        formData.append("nivel", nivel);
        formData.append("sub_nivel", novoSubNivel);
        formData.append("_token", token);
        formData.append(
            "nome_avatar",
            this.geraNomeAvatar(acertos, erros, nivel)
        );

        fetch("/atualiza-nivel", {
            method: "post",
            body: formData
        })
        .then(r => {
            if (r.ok) {
                return r.json();
            }
        })
        .then(r => {
            this.setState({
                subNivel: r.sub_nivel,
                nivel: r.nivel,
                avatar: {
                    nome: r.avatar_name
                }
            });
        });
    }

    geraNomeAvatar(acertos, erros, nivel) {
        // cada item representa um nível
        const substantivos = [
            "Iniciante ",
            "Estudante ",
            "Violonista ",
            "Musicista ",
            "Mestre ",
            "Bacharel "
        ];

        // cada item representa uma qualidade de acordo com a quantidade de acertos e erros
        const adjetivosPositivos = [
            "adorável",
            "cordial",
            "decente",
            "doce",
            "eficiente",
            "eloquente",
            "entusiasta",
            "excelente",
            "exigente",
            "fiel",
            "forte",
            "gentil",
            "humilde",
            "independente",
            "inteligente",
            "leal",
            "legal",
            "livre",
            "otimista",
            "paciente",
            "perfeccionista",
            "perseverante",
            "persistente",
            "pontual",
            "prudente",
            "racional",
            "responsável",
            "sagaz",
            "sensível",
            "tolerante",
            "valente",
            "calculista"
        ];
        const adjetivosNegativos = [
            "desobediente",
            "impaciente",
            "imprudente",
            "inconstante",
            "inconveniente",
            "negligente",
            "pessimista",
            "pé-frio"
        ];

        // cada item representa uma atualização no avatar
        const complementos = [
            // acessorios musical
            "do violão de 6 cordas",
            "do vassourolão",
            "das cordas estouradas",
            "da viola de luthier",
            "na palhetada",
            "das unhas grandes",
            // acessório dia-a-dia
            "da cabeleira marrenta",
            "do oclinho estiloso",
            "de roupinha nova",
            "do sapato velho",
            "da blusa emprestada",
            // lugar (plano de fundo pro avatar)
            "da casa",
            "da rua do lado do sol fa mi",
            "do beco dos perdidos",
            // comportamento
            "do cacuete engraçado",
            "da tremedeira na perninha",
            "das ideias boas"
        ];

        let nomeAvatar = substantivos[parseInt(nivel / 10)];

        nomeAvatar += ' ' + this.geraTextoAletorio(acertos > erros ? adjetivosPositivos : adjetivosNegativos);

        if (nivel >= 10) {
            nomeAvatar += ' ' + this.geraTextoAletorio(complementos);
        }

        return nomeAvatar;
    }
    
    geraTextoAletorio(array) {
        const num = parseInt(1 + Math.random() * (array.length - 1));
        return array[num];
    }

    proximaQuestao() {
        this.state.respondido
            ? (this.resetarMensagens(),
            this.escala.reordenarEscalaDiatonica(
                this.escala.geraNumeroAleatorio()
            ))
            : this.setState({ mensagemErro: "Responda a Pergunta" });
    }

    resposta(gabarito) {
        !this.state.respondido
            ? (this.resetarMensagens(),
              this.verificarResposta(gabarito, new FormData()),
              document.querySelector(".input-group input").value = "")
            : this.setState({ mensagemErro: "Pergunta já respondida" });
    }

    resetarMensagens() {
        this.setState({
            respondido: null,
            respostaCerta: null,
            mensagemErro: null
        });
    }

    verificarResposta(gabarito, formData) {
        const resposta = document.querySelector(".input-group input").value;
        const resultado =
            resposta.toUpperCase() == gabarito.toUpperCase() ? 1 : 0;
        const token = document.querySelector("input[name=_token]").value;
        formData.append("id", this.props.usuario.id);
        formData.append("resultado", resultado);
        formData.append("_token", token);

        this.setState({
            respondido: true,
            respostaCerta: resultado
        });

        fetch("/decifrar", {
            method: "post",
            body: formData
        })
            .then(r => {
                if (r.ok) {
                    return r.json();
                }
            })
            .then(r => {
                let novoSubNivel = parseInt(r.exercicio.acertos / 3);
                if (novoSubNivel !== parseInt(r.sub_nivel)) {
                    this.atualizaNivel(
                        new FormData(),
                        parseInt(novoSubNivel / 10),
                        novoSubNivel,
                        r.exercicio.acertos,
                        r.exercicio.erros,
                        token
                    );
                }
            });
    }
    
    limite(subNivel) {
        return subNivel == 0 ? 2 : this.state.subNivel == 1 ? 1 : 0;
    }

    render() {
        return (
            <div>
                <div className="avatar-container alert">
                    <p>{this.state.avatar.nome}</p>
                    <hr
                        className="barra-sub-nivel m-0"
                        title={`Nível: ${this.state.nivel} \n ${this.barra}`}
                        style={{ width: this.barra }}
                    />
                </div>
                <p>Qual é a cifra desta nota?</p>
                <ul className="list-group">
                    {this.escala.notas.map((nota, index) => {
                        let limite = this.limite(this.state.subNivel);

                        return index <= limite ? (
                            <li key={index} className="list-group-item">
                                <div className="row d-flex justify-content-center align-items-center">
                                    <span className="col-2">{nota.nome}</span>
                                    <span>=</span>
                                    <span className="col-3">
                                        {index == limite ? (
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    className="form-control text-center"
                                                    onChange={e => e.target.value = e.target.value.toUpperCase()}
                                                    placeholder="?"
                                                />
                                                <button
                                                    onClick={() => this.resposta(nota.cifra)}
                                                    className="btn btn-outline-primary"
                                                    type="button"
                                                >
                                                    <i className="fas fa-check"></i>
                                                </button>
                                            </div>
                                        ) : (
                                            nota.cifra
                                        )}
                                    </span>
                                </div>
                            </li>
                        ) : (
                            ""
                        );
                    })}
                </ul>
                {this.state.respondido && this.state.respostaCerta ? (
                    <div className="alert alert-success">
                        <p>Resposta certa</p>
                    </div>
                ) : (
                    ""
                )}
                {this.state.respondido && !this.state.respostaCerta ? (
                    <div className="alert alert-danger">
                        <p>Resposta Errada</p>
                    </div>
                ) : (
                    ""
                )}
                <button className="btn btn-outline-primary mt-2" onClick={this.proximaQuestao.bind(this)}>Próximo</button>
                {this.state.mensagemErro ? (
                    <p className="text-danger">{this.state.mensagemErro}</p>
                ) : (
                    ""
                )}
            </div>
        );
    }
}

export default Decifrar;
