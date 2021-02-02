import React, { Component } from 'react';
import Escalas from "../../dados/Escalas";

const geraEscala = () => {
    let escala = this.escala.formarEscala(this.state.tom, this.state.tipo);
    escala
        ? this.setState({
            erro: false,
            escala: escala.notas,
            modo: escala.modo
        })
        : this.setState({ erro: true, escala: null, modo: null })
}
class Conteudo extends Component {
    constructor() {
        super()
        this.escala = new Escalas();
        this.nova_escala = null,
        this.escolherTipo = this.escolherTipo.bind(this);
        this.defineTom = this.defineTom.bind(this);
        this.geraEscala = this.geraEscala.bind(this);
        this.state = {
            escala: null,
            tom: null,
            modo: null,
            tipo: "1",
            erro: false
        }
    }

    escolherTipo(e) {
        !this.state.tom ? this.setState({tom: "A"}) : ''
        this.setState({
                tipo: e.target.value
            },
            this.geraEscala
        )
    }

    geraEscala() {
        let escala = this.escala.formarEscala(this.state.tom, this.state.tipo);
        escala
            ? this.setState({
                erro: false,
                escala: escala.notas,
                modo: escala.modo
            })
            : this.setState({ erro: true, escala: null, modo: null })
    }

    defineTom(e) {
        switch (e.target.value) {
            case '':
                this.setState({erro: false, escala: null, modo: null})
                break;
        
            default:
                this.setState(
                    {tom: e.target.value},
                    this.geraEscala
                )
                break;
        }
    }

    render() {
        return ( 
            <div className="container py-4">
               <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            {this.state.modo ?
                            <h1>Escala {this.state.modo}</h1>
                            : ""}
                            <span className="text-secondary mb-4">Insira um tom para visualizar sua escala</span>
                            <div className="input-group input-group-sm w-25 m-auto">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Tom:</span>
                                </div>
                                <input
                                    placeholder="Ex.: A"
                                    aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                                    className="form-control"
                                    type="text"
                                    onChange={ this.defineTom }
                                />
                            </div>
                            <div>
                                <div className="form-check form-check-inline m-2">
                                    <input className="form-check-input" value="1" type="radio" name="diatonica" id="flexRadioDefault1" checked={this.state.tipo == "1"} onChange={this.escolherTipo} />
                                    <label className="form-check-label mr-2" htmlFor="diatonica">
                                        Diatônica
                                    </label>
                                    <input className="form-check-input" value="0" type="radio" name="cromatica" id="flexRadioDefault2" checked={this.state.tipo == "0"} onChange={this.escolherTipo} />
                                    <label className="form-check-label" htmlFor="cromatica">
                                        Cromática
                                    </label>
                                </div>
                            </div>
                            {this.state.erro ?
                            <span className="text-danger font-italic">*Escala Não reconhecida</span>
                            :''}
                            {this.state.escala ?                            
                                <p>{this.state.escala.map( (nota,index) => {
                                    return <span className="p-2" key={index}>{nota.cifra}</span>
                                })}</p>
                            : ''}
                        </div>
                    </div>
                </div>
            </div>
         );
    }
}
 
export default Conteudo;