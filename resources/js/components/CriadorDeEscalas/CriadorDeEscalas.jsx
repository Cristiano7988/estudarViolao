import React, { Component } from 'react';
import Escalas from "../../dados/Escalas";
import Braco from '../Braco';
class CriadorDeEscalas extends Component {
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

    segunda(soma) {
        let intervalo = {};
        switch (soma) {
            case 0:
                intervalo.nome = "diminuta"
                intervalo.valor = "unissono"
                break;
            
            case 0.5:
                intervalo.nome = "menor"
                intervalo.valor = String.fromCharCode(189) +" tom"
                break;
            
            case 1:
                intervalo.nome = "maior"
                intervalo.valor = "Tom"
                break;

            case 1.5:
                intervalo.nome = "aumentada"
                intervalo.valor = "Tom e " + String.fromCharCode(189)
                break;

            default:
                break;
        }
        return intervalo;
    }

    terca(soma) {
        let intervalo = {};
        switch (soma) {
            case 1:
                intervalo.nome = "diminuta"
                intervalo.valor = "Tom"
                break;
            
            case 1.5:
                intervalo.nome = "menor"
                intervalo.valor = "Tom e " + String.fromCharCode(189)
                break;
            
            case 2:
                intervalo.nome = "maior"
                intervalo.valor = "2 Tons"
                break;

            case 2.5:
                intervalo.nome = "aumentada"
                intervalo.valor = "2 Tons e " + String.fromCharCode(189)
                break;

            default:
                break;
        }
        return intervalo;
    }

    comparar(nota1, nota2, cromatica) {
        // pega a posição dos homonimos da escala diatonica na escala cromatica
        let index = cromatica.homonimos.findIndex( homonimo=> homonimo.match(`\\[${nota1}\\]`) )
        let index2 = cromatica.homonimos.findIndex( homonimo=> homonimo.match(`\\[${nota2}\\]`) )
        let soma = 0;

        let id2 = cromatica.notas[index2].id;
        let id = cromatica.notas[index].id;
        // Calculo distancia entre as notas
        let distancia = {}

        distancia.diatonica = id2 - id;
        distancia.cromatica = index2 - index
         
        // Calculo para 2 oitavas
        if(distancia.cromatica < 0) {
            distancia.cromatica = ((index2 + 12) - index) % 13
        }
        if(distancia.diatonica < 0 ) {
            distancia.diatonica = ( (id2 + 7) - id ) % 9
        }

        soma = distancia.cromatica * 0.5

        switch (distancia.diatonica) {
            case 1:
                return this.segunda(soma, "segunda");
                break;
            case 2:
                return this.terca(soma, "terça")
            default:
                break;
        }
    }

    geraEscala() {
        try {
            let escala = this.escala.formarEscala(this.state.tom, this.state.tipo, this.state.complemento);
            var cromatica = this.escala.formarEscala(this.state.tom, 0)
    
            cromatica.homonimos = []
            cromatica.notas.map(nota => {
                cromatica.homonimos.push(this.escala.pegaHomonimos(nota.cifra))
            })

            var intervalos = []
            escala.notas.map( (nota, indice)=> {
                intervalos.push(this.comparar(nota.cifra, escala.notas[(indice + 1) % escala.notas.length].cifra, cromatica))
            });

            escala
                ? this.setState({
                    erro: false,
                    escala: escala.notas,
                    modo: escala.modo,
                    complemento: escala.complemento,
                    intervalos: intervalos
                })
                : this.setState({ erro: true, escala: null, modo: null, complemento: null, intervalos: null })   
        } catch (error) {
            this.setState({ erro: true, escala: null, modo: null, complemento: null, intervalos: null })
        }
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
                            {!this.state.escala ?
                                <span className="text-secondary mb-4">Insira um tom para visualizar sua escala</span>
                            :''}
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
                                <div className="d-flex justify-content-between pr-5 mb-5 mt-5" style={{ background: '#a6540d', borderRadius: '5px'}}>{this.state.escala.map( (nota,index) => {
                                    return (
                                        <div
                                            className="p-2"
                                            key={index}
                                            style={{position: 'relative'}}
                                        >
                                            <p
                                                style={{color: 'white',cursor: "pointer"}}
                                                onMouseOver={()=>this.highlight(nota.cifra)}
                                                onMouseLeave={()=>this.limpaHighlight()}
                                            >{nota.cifra}</p>
                                            {this.state.tipo == "1" ?
                                                <p
                                                    title={this.state.intervalos[index].nome}
                                                    style={{position: "absolute", top: '115%',left: "130%", minWidth: "33px"}}
                                                >{this.state.intervalos[index].valor}</p>
                                            : ''}  
                                        </div>
                                    )
                                })}</div>
                            : ''}
                        </div>
                    </div>
                </div>
            </div>
         );
    }
}
 
export default CriadorDeEscalas;