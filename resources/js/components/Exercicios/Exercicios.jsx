import React, { Component } from "react";
import Escalas from "../../dados/Escalas";
import Decifrar from "../Decifrar";
import Ordenar from "../Ordenar";

const getUser = (exercicio, item) => {
    let resultados = JSON.parse(document.querySelector("[data-usuario]").dataset.usuario);
    
    let resultados_exercicio = resultados.find(resultado=> {return resultado.exercicio === exercicio})
    return resultados_exercicio[item];
};

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
    constructor(props) {
        super(props);
        this.escala = new Escalas();
        this.exercicio = this.props.match.params.exercicio
        this.onDragEnd = this.onDragEnd.bind(this);
        this.escala_reordenada = this.escala.geraEscalaAleatoria();

        this.state = {
            escala: this.escala.geraEscalaAleatoria(),
            escala_reordenada: mudarPosicao( this.escala_reordenada.notas ),

            respondido: null,
            respostaCerta: null,
            mensagemErro: null,

            acertos: getUser(this.exercicio, 'acertos'),
            erros: getUser(this.exercicio, 'erros'),
            concluido: parseInt(getUser(this.exercicio, 'concluido'))
        };
    }



    porcentagem() {
        let acertos = parseInt(this.state.acertos);
        let erros = parseInt(this.state.erros);

        let total = (acertos - erros) * 10;

        total = total <= 0 ? "0%" : total + "%";

        return total;
    }

    // Tratamento de resposta
    salvarResultado(exercicio, resultado) {
        let token = document.querySelector("input[name=_token]").value;
        let formData = new FormData();

        formData.append("id", getUser(this.exercicio, 'user_id'));
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
            ? (this.escala_reordenada = this.escala.geraEscalaAleatoria(),
                this.setState({
                  escala: this.escala.geraEscalaAleatoria(),
                  escala_reordenada: mudarPosicao( this.escala_reordenada.notas )
              }),
              this.resetarMensagens())
            : this.setState({ mensagemErro: "Responda a Pergunta" });
        return this.state.respondido;
    }

    verificaResposta() {
        
        if(this.state.respondido) {
            return this.setState({ mensagemErro: "Pergunta já respondida" });
        }

        switch (this.exercicio) {
            case "decifrar":
                this.verificarCifra(
                    document.querySelector(".resposta").dataset.resposta,
                    this.exercicio
                );       
                break;

            case "ordenar":
                this.verificaOrdem(
                    document.querySelectorAll("[data-rbd-draggable-id]"),
                    this.exercicio
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

    getResultados(id_exercicio) {

        fetch(`/resultados/${id_exercicio}`, {
            method: "get",
        })
        .then(r=>{
            if(r.ok) {
                return r.json();
            }
        }).then(r=>{
            if(this.state.acertos != r.acertos || this.state.erros != r.erros) {
                this.setState({
                    acertos: r.acertos,
                    erros: r.erros,
                    concluido: parseInt(getUser(this.exercicio, "concluido"))
                })
            }
            if(this.porcentagem() == "100%" && !this.state.concluido) {
                fetch(`/conclui/${getUser(this.exercicio, "id")}`)
                this.setState({concluido: true})
            }
        })
    }

    componentDidUpdate() {
        if(this.exercicio != this.props.match.params.exercicio) {
            this.exercicio = this.props.match.params.exercicio;
            this.resetarMensagens();
        } else {
            this.getResultados(getUser(this.props.match.params.exercicio, 'id'))
        }
    }

    classeInsignia() {
        let nome = getUser(this.exercicio, "insignia");

        return nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]|[^a-z]/g, "");
    }

    citacao(insignia) {
        switch (insignia) {
            case "guidodarezzo":
                return `"Benedito Guido d'Arezzo foi (...) o inventor inconsciente dos nomes atuais dos sons,\npor ter se utilizado (...) das silabas Ut Re Mi Fa Sol La, tiradas da abertura de cada\nhemistíquio do Hino a São João Batista"\n\nANDRADE, Mário de. Pequena História da Música.`

            case "pitagoras":
                return `"O advento da escala (...) diatônica está historicamente associado ao\nfilósofo e matemático grego Pitágoras (...).\n\nA partir da experiência de subdivisão da corda de um monocórdio, (...)\nPitágoras chegou à conclusão de que as combinações tidas na época\ncomo "consonantes" e correspondente ao que hoje designamos por oitava,\nquinta, quarta e uníssono estão, respectivamente, nas proporções:\n\n2:1, 3:2, 4:3, 1:1"\n\nFILHO, Floriano Menezes. A acústica Musical em palavras e sons.`;
        
            default:
                break;
        }
    }

    render() {
        return (
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <h1 className="text-capitalize">{this.exercicio}</h1>
                            {this.exercicio == "decifrar" ? (
                                <Decifrar
                                    escala={this.state.escala}
                                    // sub_nivel={this.state.subNivel}
                                />
                            ) : (
                                ""
                            )}
                            {this.exercicio == "ordenar" ? (
                                <Ordenar
                                    escala={this.state.escala_reordenada}
                                    modo={this.escala_reordenada.modo}
                                    complemento={this.escala_reordenada.complemento ? this.escala_reordenada.complemento : ''}
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
                                
                                {this.state.concluido ?
                                    <div className="container-insignia">
                                        <i
                                            className={`insignia ${this.classeInsignia()}`}
                                            title={this.citacao(this.classeInsignia())}
                                        ></i>
                                        <span>
                                            {getUser(this.exercicio, "insignia")}
                                        </span>
                                    </div>
                                    : <div className="text-left">
                                        <span>Progresso: {this.porcentagem()}</span>
                                        <hr className="barra-progresso m-0" style={{ width: this.porcentagem() }} />
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
