import React, { Component } from 'react';
import Escalas from "../../dados/Escalas";
import Braco from '../Braco';
class Conteudo extends Component {
    constructor() {
        super()
        this.escala = new Escalas();
        this.nova_escala = null,
        this.escolherTipo = this.escolherTipo.bind(this);
        this.escolherComplemento = this.escolherComplemento.bind(this);
        this.defineTom = this.defineTom.bind(this);
        this.geraEscala = this.geraEscala.bind(this);
        this.state = {
            escala: null,
            tom: null,
            modo: null,
            complemento: null,
            tipo: "1",
            erro: false
        }
    }

    limpaHighlight() {
        let casas = Array.prototype.slice.call(document.querySelectorAll('[data-nota]'));
        casas.map(casa=>casa.classList.remove('highlight'));
    }

    highlight(nota) {
        this.limpaHighlight();
        let casas = Array.prototype.slice.call(document.querySelectorAll('[data-nota]'));
        
        casas.find(casa=>{
            let homonimos = new RegExp(`\\[${nota}\\]`)

            if(casa.dataset.nota.match(homonimos)) {
                casa.classList.add('highlight')
            }
        })
    }

    escolherTipo(e) {
        !this.state.tom ? this.setState({tom: "A"}) : ''
        this.setState({
                tipo: e.target.value
            },
            this.geraEscala
        )
    }

    escolherComplemento(e) {
        this.setState({
                complemento: e.target.value
            },
            this.geraEscala
        )
    }

    geraEscala() {
        let escala = this.escala.formarEscala(this.state.tom, this.state.tipo, this.state.complemento);
        escala
            ? this.setState({
                erro: false,
                escala: escala.notas,
                modo: escala.modo,
                complemento: escala.complemento
            })
            : this.setState({ erro: true, escala: null, modo: null, complemento: null })
    }

    defineTom(e) {
        switch (e.target.value) {
            case '':
                this.setState({erro: false, escala: null, modo: null, complemento: null})
                break;
        
            default:
                this.setState(
                    {tom: e.target.value,
                    complemento: e.target.value.match(/m/) ? "natural" : null},
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
                            <h1 className="text-capitalize">Escala {this.state.modo} {this.state.complemento ? this.state.complemento : ""}</h1>
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
                            {this.state.modo == "menor" ?
                                <div>
                                    <div className="form-check form-check-inline m-2">
                                        <input className="form-check-input" value="natural" type="radio" name="natural" id="flexRadioDefault1" checked={this.state.complemento == "natural"} onChange={this.escolherComplemento} />
                                        <label className="form-check-label mr-2" htmlFor="natural">
                                            Natural
                                        </label>
                                        <input className="form-check-input" value="harmonica" type="radio" name="harmonica" id="flexRadioDefault2" checked={this.state.complemento == "harmonica"} onChange={this.escolherComplemento} />
                                        <label className="form-check-label mr-2" htmlFor="harmonica">
                                            Harmônica
                                        </label>
                                        <input className="form-check-input" value="melodica" type="radio" name="melodica" id="flexRadioDefault2" checked={this.state.complemento == "melodica"} onChange={this.escolherComplemento} />
                                        <label className="form-check-label" htmlFor="melodica">
                                            Melódica
                                        </label>
                                    </div>
                                </div>
                            : ""}
                            {this.state.erro ?
                            <span className="text-danger font-italic">*Escala Não reconhecida</span>
                            :''}
                            {this.state.escala && parseInt(this.state.tipo) ?
                                <div>
                                    <Braco escala={this.state.escala} />
                                </div>
                            : ''}
                            {this.state.escala ?                            
                                <p>{this.state.escala.map( (nota,index) => {
                                    return <span className="p-2" key={index} style={{cursor: "pointer"}} onMouseOver={()=>this.highlight(nota.cifra)} onMouseLeave={()=>this.limpaHighlight()}> {nota.cifra}</span>
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