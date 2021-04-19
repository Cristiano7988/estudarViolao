import { isEmpty } from 'lodash';
import React, { Component } from 'react';
import Escalas from '../../dados/Escalas';

class Braco extends Component {
    constructor(props) {
        super(props);
        this.escala = new Escalas();
        this.nomear = this.nomear.bind(this);
        this.state = { 
            cifra: "Nome",
            braco: this.props.braco,
            afinada: false,
            cordas: [
                this.escala.aumentaUmaOitava(this.escala.formarEscala("E", false).notas),
                this.escala.aumentaUmaOitava(this.escala.formarEscala("A", false).notas),
                this.escala.aumentaUmaOitava(this.escala.formarEscala("D", false).notas),
                this.escala.aumentaUmaOitava(this.escala.formarEscala("G", false).notas),
                this.escala.aumentaUmaOitava(this.escala.formarEscala("B", false).notas),
                this.escala.aumentaUmaOitava(this.escala.formarEscala("E", false).notas)
            ],
            tessitura: {
                inicio: 0,
                fim: 5
            },
        };
    };

    componentDidUpdate() {
        // Limpa o braço para poder atualizá-lo em seguida
        document.querySelectorAll(`[data-id='${this.props.id}'] .active`).forEach(el=>el.classList.remove("active"));
        if(this.props.digitar) this.habilitaMarcador();
        if(this.props.escala) this.digitaEscala(); 
    }

    mudaAfinacao(nota, indiceCorda) {
        const cordas = this.state.cordas;
        const afinada = true;

        if(!nota.match(/##|bb/)) {
            cordas[indiceCorda] = this.escala.aumentaUmaOitava(this.escala.formarEscala(nota, false).notas);
            this.setState({cordas, afinada});
            return;
        } else {
            let homonimos = this.escala.pegaHomonimos(nota);
            homonimos = homonimos.split(" ");
            
            homonimos.forEach(homonimo => {
                if(!homonimo.match(/##|bb/)) {
                    homonimo = homonimo.replace(/\[|\]/g, "");
                    cordas[indiceCorda] = this.escala.aumentaUmaOitava(this.escala.formarEscala(homonimo, false).notas);
                    this.setState(cordas);
                };
            });
        };
    }

    habilitaMarcador() {
        this.state.braco.cordas.forEach(corda => {
            if(!corda.notas) return false;

            corda.notas.forEach( (nota, indiceArray) => {
                let elementos =
                    Array.prototype.slice.call(
                        document.querySelectorAll(
                            `[data-id="${this.props.id}"] [data-corda="${corda.numero}"]`
                        )
                    );
                elementos.forEach(elemento => {
                    const notas = nota.split(" ");

                    notas.forEach(notaProcurada => {
                        // Substitui [C#] por /\[C#\]/
                        notaProcurada = notaProcurada.replace(/\]/g, "\\]")
                        const regex = new RegExp(`\\${notaProcurada}`);

                        let idOitava = this.props.estender
                            ? elemento.dataset.idoitava
                            : elemento.dataset.casa;

                        const oitavaArray = parseInt(corda.oitavas[indiceArray] / 12);
                        const oitavaElemento = parseInt(idOitava / 12);
                        
                        if(regex.test(elemento.dataset.nota) && oitavaElemento == oitavaArray) {
                            elemento.classList.add('active');
                        }
                    });
                });
            });
        });
    }
    
    componentDidMount() {
        if(this.props.escala) this.digitaEscala();
    }
    
    nomear(e) { 
        e.preventDefault();
        this.setState({cifra: e.target.value});
    }
    
    verificaSaves(indice, idOitava, nota) {
        let apagar = false;
        const cordas = this.state.braco.cordas;
        const corda = cordas[indice-1];
        
        if(!corda) return false;
            
        let notas = corda.notas.map( (notaVerificada, indiceArray) => {        
            const oitavaArray = parseInt(corda.oitavas[indiceArray] / 12);
            const oitavaElemento = parseInt(idOitava / 12);

            if(notaVerificada == nota && oitavaArray == oitavaElemento) {
                apagar = true;
                return false;
            } else {
                return notaVerificada;
            };
        });
        let oitavas = corda.oitavas.map( oitavaVerificada => {
            if(oitavaVerificada == idOitava && apagar) {
                return false;
            } else {
                return oitavaVerificada;
            };
        });
        
        notas = notas.filter(Boolean);
        oitavas = oitavas.filter(Boolean);
        
        if(isEmpty(notas)) {
            cordas.splice(indice - 1, 1, false);
            
            this.setState({ braco: {cordas} });
            return true;
        }
        else if(apagar) {
            cordas[indice - 1].notas = notas;
            cordas[indice - 1].oitavas = oitavas;
            
            this.setState({ braco: {cordas} });
            return true;
        }
    }

    marcar(indiceCorda, idOitava, nota) {
        if(!this.props.digitar) return false;
        if(this.verificaSaves(indiceCorda, idOitava, nota)) return false;

        const cordas = this.state.braco.cordas;
        const notas = cordas[indiceCorda - 1]
            ? cordas[indiceCorda - 1].notas
            : [];
        const oitavas = cordas[indiceCorda - 1]
            ? cordas[indiceCorda - 1].oitavas
            : [];
        
        notas.push(nota);
        oitavas.push(idOitava);

        cordas[indiceCorda - 1] = {
            numero: indiceCorda,
            oitavas,
            notas
        }
        
        const braco = {...this.state.braco, cordas};
        this.setState({braco: braco});
    }

    mudaPosicao(sobe) {
        sobe ?
            this.setState({
                tessitura: {
                    inicio: this.state.tessitura.inicio < 15 ? this.state.tessitura.inicio + 1 : 15,
                    fim: this.state.tessitura.fim < 20 ? this.state.tessitura.fim + 1 : 20
                }
            })
        : this.setState({
            tessitura: {
                inicio: this.state.tessitura.inicio > 0 ? this.state.tessitura.inicio - 1 : 0,
                fim: this.state.tessitura.fim > 5 ? this.state.tessitura.fim - 1 : 5
            }
        })
    }

    digitaEscala() {
        document.querySelectorAll('.active').forEach(elemento=>{
            elemento.classList.remove('active');
        });
        let casas = Array.prototype.slice.call(document.querySelectorAll("[data-nota]"));

        if(this.props.escala) {
            casas.every( casa => {

                this.props.escala.every( nota => {

                    let homonimos = new RegExp(`\\[${ nota.cifra }\\]`)

                    if(casa.dataset.nota.match( homonimos )) {
                        casa.classList.add('active')
                        casa.parentNode.setAttribute('title', nota.cifra)
                    }

                    return true
                })

                return true
            })
        }
    }

    render() {
        return (
        <>
        {this.props.digitar ?
            <div className="cifra">
                <input
                    value={this.state.cifra}
                    type="text"
                    data-input={this.props.id}
                    onChange={this.nomear}
                    style={{border: "none"}}
                    className="text-center cifra"
                />
            </div>
        :""}
        <div className="d-flex justify-content-center">
        {!this.props.estender ?
            <div className={`d-flex flex-column ${this.props.afinar ? "pt-5 mt-4" : "pt-4"} ${this.state.afinada ? "mt-3": ""}`}>
                <p>{this.state.tessitura.inicio + 1}ª</p>
                <div className="d-flex flex-column align-items-center">
                    <i className="seta up" onClick={(e)=>this.mudaPosicao(0)}></i>
                    <i className="seta down" onClick={(e)=>this.mudaPosicao(1)}></i>
                </div>
            </div>
            : ""}
            <div className="braco" data-id={this.props.id}>
                {this.state.cordas.map( (corda, indiceCorda) =>{
                    let posicao = (indiceCorda - 6) * -1;

                    return <div key={indiceCorda} className={`corda corda-${posicao}`}>
                        {corda.map( (nota, indiceCasa)=> {
                        let inicio = this.props.estender
                            ? indiceCasa 
                            : indiceCasa + this.state.tessitura.inicio;
                        let final = this.props.estender
                            ? 16
                            : this.state.tessitura.fim;
                        const notaAtual = corda[inicio % corda.length].cifra;
                        const homonimos = this.escala.pegaHomonimos(notaAtual);

                        const proxima = corda[(nota.idOitava + 1) % 12].cifra;
                        const anterior = corda[(nota.idOitava + 11)  % 12].cifra;

                        return indiceCasa == 0 ? (
                            <div key={indiceCasa} className="afinacao" style={{cursor: this.props.digitar ? "pointer" : "unset"}}>
                                {this.props.afinar ? 
                                    <div className="afinada">
                                        <b  className="seta up"
                                            onClick={(e)=>this.mudaAfinacao( proxima, indiceCorda )}
                                        ></b>
                                        <b>{nota.cifra}</b>
                                        <b  className="seta down"
                                            onClick={(e)=>this.mudaAfinacao( anterior, indiceCorda )}
                                        ></b>
                                    </div>
                                    : ''}
                                {this.state.afinada && !this.props.afinar ? <b>{nota.cifra}</b> : ""}
                                <span
                                    data-corda={posicao}
                                    data-casa={indiceCasa}
                                    data-idoitava={nota.idOitava}
                                    data-nota={this.escala.pegaHomonimos(nota.cifra)}
                                    title={this.props.escala ? nota.cifra : this.escala.pegaHomonimos(nota.cifra)}
                                    onClick={()=>this.marcar(posicao, nota.idOitava, this.escala.pegaHomonimos(nota.cifra) )}
                                ></span>
                            </div>
                        ) : ( inicio <= final ? 
                            
                            <div key={indiceCasa}
                                className="casa"
                                style={{cursor: this.props.digitar ? "pointer" : "unset"}}
                                onClick={()=>this.marcar(posicao, nota.idOitava, homonimos)}
                            >
                                <hr />
                                <span
                                    data-corda={posicao}
                                    data-casa={inicio}
                                    data-idoitava={nota.idOitava}
                                    data-nota={homonimos}
                                    title={ this.props.escala ? nota.cifra : homonimos }
                                ></span>
                            </div>
                         : ("")
                    )})}
                    </div>
                })}
            </div>
        </div>
        </>
        );
    }
}
 
export default Braco;