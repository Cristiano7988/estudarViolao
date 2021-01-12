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

            // nivel: getUser().nivel,
            // subNivel: getUser().sub_nivel,
        };
    }



    porcentagem(string) {
        return parseInt(string[string.length - 1] * 10) + "%";
    }

    // Tratamento de resposta
    salvarResultado(exercicio, resultado) {
        let token = document.querySelector("input[name=_token]").value;
        let formData = new FormData();

        formData.append("id", getUser().id);
        formData.append("resultado", resultado);
        formData.append("_token", token);
        formData.append("exercicio", exercicio);

        this.setState({
            respondido: true,
            respostaCerta: resultado
        });

        fetch("/salvar-resultado", {
            method: "post",
            body: formData
        })
        .then(r => {
            if (r.ok) {
                return r.json();
            }
        })
        .then(r => {
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

    verificaResposta() {
        let exercicio = this.props.match.params.exercicio;
        
        if(this.state.respondido) {
            return this.setState({ mensagemErro: "Pergunta já respondida" });
        }

        switch (exercicio) {
            case "decifrar":
                this.verificarCifra(
                    document.querySelector(".resposta").dataset.resposta,
                    exercicio
                );       
                break;

            case "ordenar":
                this.verificaOrdem(
                    document.querySelectorAll("[data-rbd-draggable-id]"),
                    exercicio
                );
                break;
        
            default:
                break;
        }
    }

    // Funções de Decifrar
    verificarCifra(gabarito, exercicio) {
        const resposta = document.querySelector(".input-group input").value;

        this.salvarResultado(
            exercicio,
            resposta.toUpperCase() == gabarito.toUpperCase() ? 1 : 0
        )
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

    verificaOrdem(escala, exercicio) {
        let resultado = 1;

        escala.forEach((posicao, i) => {
            if (posicao.dataset.rbdDraggableId != i) {
                posicao.classList.add("errado");
                resultado = 0;
            }
        });

        this.salvarResultado(
            exercicio,
            resultado
        );
    }

    render() {
        return (
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <h1 className="text-capitalize">{this.props.match.params.exercicio}</h1>
                            {this.props.match.params.exercicio == "decifrar" ? (
                                <Decifrar
                                    escala={this.state.escala}
                                    // sub_nivel={this.state.subNivel}
                                />
                            ) : (
                                ""
                            )}
                            {this.props.match.params.exercicio == "ordenar" ? (
                                <Ordenar
                                    escala={this.state.escala_reordenada}
                                    onDragEnd={this.onDragEnd}
                                />
                            ) : (
                                ""
                            )}
                            <div className="d-flex justify-content-around mb-2">
                                <button className="btn btn-primary" onClick={this.verificaResposta.bind(this)}>
                                    Verificar Resposta
                                </button>
                                <button className="btn btn-outline-primary" onClick={this.proximaQuestao.bind(this)}>
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
                            <div className="nivelamento-container alert">
                                <hr
                                    className="barra-sub-nivel m-0"
                                    // title={`Nível: ${
                                    //     this.state.nivel
                                    // } \n ${this.porcentagem(
                                    //     this.state.subNivel
                                    // )}`}
                                    // style={{
                                    //     width: this.porcentagem(
                                    //         this.state.subNivel
                                    //     )
                                    // }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
