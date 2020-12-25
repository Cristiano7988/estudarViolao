import React, { Component } from "react";
import EscalaDiatonica from "../../dados/EscalaDiatonica";

class Decifrar extends Component {
    constructor() {
        super();
        this.escala = new EscalaDiatonica();
    }
    
    state = {
        respondido: null,
        respostaCerta: null,
        mensagemErro: null
    };

    proximaQuestao() {
        this.state.respondido ? (
            this.resetarMensagens(),
            document.querySelector(".input-group input").value = "",
            this.escala.reordenarEscalaDiatonica()
        ) : (
            this.setState({mensagemErro: 'Responda a Pergunta'})
        )
    }

    resposta(gabarito) {
        !this.state.respondido ? (
            this.resetarMensagens(),
            this.verificarResposta(gabarito)
        ) : (
            this.setState({mensagemErro: 'Pergunta já respondida'})
        )
    }

    resetarMensagens() {
        this.setState({
            respondido: null,
            respostaCerta: null,
            mensagemErro: null
        });
    }

    verificarResposta(gabarito) {
        const resposta = document.querySelector(".input-group input").value;

        this.setState({
            respondido: true,
            respostaCerta: resposta.toUpperCase() == gabarito.toUpperCase()
        })
    }

    render() {
        return (
            <div>
                <p>Qual é a cifra desta nota?</p>
                <ul className="list-group">
                    {this.escala.notas.map((nota, index) => {
                        return index <= 2 ? (
                            <li key={index} className="list-group-item">
                                <div className="row d-flex justify-content-center">
                                    <span className="col-2">{nota.nome}</span>
                                    <span>=</span>
                                    <span className="col-3">
                                        {index == 2 ? (
                                            <div className="input-group">
                                                <input type="text" className="form-control" style={{ width: "50px", textAlign: "center" }} placeholder="?" />
                                                <button onClick={() => this.resposta(nota.cifra)} className="btn btn-outline-primary" type="button">
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
