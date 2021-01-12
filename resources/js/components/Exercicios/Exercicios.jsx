import React, { Component } from "react";
import Escalas from "../../dados/Escalas";
import Decifrar from "../Decifrar";
import Ordenar from "../Ordenar";

const getUser = () => JSON.parse(document.querySelector("[data-user]").dataset.user);

const mudarPosicao = (array) => {
    let de = parseInt(0 + Math.random() * (array.length - 0));
    let para = parseInt(0 + Math.random() * (array.length - 0));
    array.splice(para, 0, array.splice(de, 1)[0]);
    return array;
}

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

export default class Exercicios extends Component {
    constructor() {
        super();
        this.usuario = getUser();
        this.escala = new Escalas();
        this.onDragEnd = this.onDragEnd.bind(this);

        this.state = {
            escala: this.escala.geraEscalaAleatoria(),
            escala_reordenada: mudarPosicao(this.escala.geraEscalaAleatoria()),

            respondido: null,
            respostaCerta: null,
            mensagemErro: null,

            nivel: getUser().nivel,
            subNivel: getUser().sub_nivel,
            avatar: {
                nome: getUser().avatar_name
            }
        };
    }

    // Tratamento de Nível
    atualizaNivel(formData, nivel, novoSubNivel, acertos, erros, token) {
        formData.append("id", getUser().id);
        formData.append("nivel", nivel);
        formData.append("sub_nivel", novoSubNivel);
        formData.append("_token", token);
        formData.append("nome_avatar", this.geraNomeAvatar(acertos, erros, nivel) );

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

        nomeAvatar += ` ${this.geraTextoAletorio(acertos > erros ? adjetivosPositivos : adjetivosNegativos)}`;

        if (nivel >= 10) {
            nomeAvatar += " " + this.geraTextoAletorio(complementos);
        }

        return nomeAvatar;
    }

    geraTextoAletorio(array) {
        const num = parseInt(1 + Math.random() * (array.length - 1));
        return array[num];
    }

    porcentagem(string) {
        return parseInt(string[string.length - 1] * 10) + "%";
    }

    // Tratamento de resposta
    verificarResposta(gabarito, formData) {
        const resposta = document.querySelector(".input-group input").value;
        const resultado = resposta.toUpperCase() == gabarito.toUpperCase() ? 1 : 0;
        const token = document.querySelector("input[name=_token]").value;

        formData.append("id", getUser().id);
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

    resetarMensagens() {
        this.setState({
            respondido: null,
            respostaCerta: null,
            mensagemErro: null
        });
        document.querySelectorAll(".errado").forEach(div => div.classList.remove("errado"));
        document.querySelector(".input-group input")
            ? (document.querySelector(".input-group input").value = "")
            : "";
    }

    proximaQuestao() {
        this.state.respondido
            ? (this.setState({
                  escala: this.escala.geraEscalaAleatoria(),
                  escala_reordenada: mudarPosicao( this.escala.geraEscalaAleatoria() )
              }),
              this.resetarMensagens())
            : this.setState({ mensagemErro: "Responda a Pergunta" });
        return this.state.respondido;
    }

    // Funções de Decifrar
    resposta() {
        !this.state.respondido
            ? this.verificarResposta(
                  document.querySelector(".resposta").dataset.resposta,
                  new FormData()
              )
            : this.setState({ mensagemErro: "Pergunta já respondida" });
    }

    // Funções de Ordenar
    onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const escala_reordenada = reorder(
            this.state.escala_reordenada,
            result.source.index,
            result.destination.index
        );

        this.setState({ escala_reordenada });
    }

    verificaOrdem() {
        if (!this.state.respondido) {
            let ordem = [];
            let resultado = true;
            let id = "data-rbd-draggable-id";

            document.querySelectorAll(`[${id}]`).forEach(item => {
                ordem.push(item.dataset.rbdDragHandleDraggableId);
            });

            ordem.forEach((posicao, i) => {
                if (posicao != i) {
                    document.querySelector(`[${id}="${posicao}"]`).classList.add("errado");
                    resultado = false;
                }
            });
            this.setState({
                respostaCerta: resultado,
                respondido: true,
                mensagemErro: null
            });
        } else {
            this.setState({ mensagemErro: "Pergunta já respondida" });
        }
    }

    render() {
        return (
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <h1 className="text-capitalize">{this.props.match.params.exercicio}</h1>
                            {this.props.match.params.exercicio == "decifrar" ? (<>
                                <Decifrar
                                    escala={this.state.escala}
                                    sub_nivel={this.state.subNivel}
                                />
                                <div className="mt-2">
                                    <button className="btn btn-primary" onClick={this.resposta.bind(this)}>
                                        Verificar Resposta
                                    </button>
                                </div>
                            </>) : (
                                ""
                            )}
                            {this.props.match.params.exercicio == "ordenar" ? (<>
                                <Ordenar
                                    escala={this.state.escala_reordenada}
                                    onDragEnd={this.onDragEnd}
                                />
                                <div className="mt-2">
                                    <button className="btn btn-primary" onClick={this.verificaOrdem.bind(this)}>
                                        Verificar Ordem
                                    </button>
                                </div>
                            </>) : (
                                ""
                            )}
                            <div className="mt-2 mb-2">
                                <button
                                    onClick={this.proximaQuestao.bind(this)}
                                    className="btn btn-outline-primary"
                                >
                                    Proxima Questão
                                </button>
                            </div>
                            {this.state.respondido &&
                            this.state.respostaCerta ? (
                                <div className="alert alert-success">
                                    <p>Resposta certa</p>
                                </div>
                            ) : (
                                ""
                            )}
                            {this.state.respondido &&
                            !this.state.respostaCerta ? (
                                <div className="alert alert-danger">
                                    <p>Resposta Errada</p>
                                </div>
                            ) : (
                                ""
                            )}
                            {this.state.mensagemErro ? (
                                <p className="text-danger">
                                    {this.state.mensagemErro}
                                </p>
                            ) : (
                                ""
                            )}
                            <div className="avatar-container alert">
                                <p>{this.state.avatar.nome}</p>
                                <hr
                                    className="barra-sub-nivel m-0"
                                    title={`Nível: ${
                                        this.state.nivel
                                    } \n ${this.porcentagem(
                                        this.state.subNivel
                                    )}`}
                                    style={{
                                        width: this.porcentagem(
                                            this.state.subNivel
                                        )
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
