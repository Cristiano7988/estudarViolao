import React, { Component } from 'react';
import Escalas from '../../dados/Escalas';

class Braco extends Component {
    constructor(props) {
        super(props)
        this.escala = new Escalas()
        this.state = { 
            cordas: [
                this.escala.formarEscala("E", 0).notas,
                this.escala.formarEscala("A", 0).notas,
                this.escala.formarEscala("D", 0).notas,
                this.escala.formarEscala("G", 0).notas,
                this.escala.formarEscala("B", 0).notas,
                this.escala.formarEscala("E", 0).notas
            ],
            tessitura: {
                inicio: 0,
                fim: 5
            },
            erro: {
                afinacao: false
            }
        }
        this.afina = this.afina.bind(this)
    }

    componentDidUpdate() {
        document.querySelectorAll(".active").forEach(el=>el.classList.remove("active"));
        this.digitaEscala();
    }

    componentDidMount() {
        this.digitaEscala()
    }

    afina(e) {
        let valido = e.target.value.match(/^[A-G]|[b#]/)
        if(!valido) {
            this.setState({
                erro: {
                    afinacao: true
                }
            })
            return false
        }

        try {
            let casas = e.target.parentNode.parentNode.childNodes
            let cordas = this.state.cordas
    
            cordas[e.target.dataset.id] = this.escala.formarEscala(e.target.value, 0).notas;
            casas[0].firstChild.placeholder = e.target.value
            
            this.setState({
                cordas: cordas,
                erro: {
                    afinacao: false
                }
            })
        } catch(error) {

        }
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
        let casas = Array.prototype.slice.call(document.querySelectorAll("[data-nota]"));

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

    render() {
        return (
        <>
        {this.state.erro.afinacao ?
            <i className="text-danger">Nota inválida</i>
        : ''}
        <div className="d-flex justify-content-center">
            <div className="d-flex flex-column justify-content-center">
                <p>{this.state.tessitura.inicio + 1}ª</p>
                <div className="d-flex flex-column align-items-center">
                    <i className="seta up" onClick={(e)=>this.mudaPosicao(0)}></i>
                    <i className="seta down" onClick={(e)=>this.mudaPosicao(1)}></i>
                </div>
            </div>
            <div className="braco">
                {this.state.cordas.map( (corda,index) =>{
                    return <div key={index} className="corda">{corda.map( (nota, indice)=> {
                        return indice == 0 ? (
                            <div key={indice} className="afinacao">
                                <input type="text" onChange={this.afina} data-id={index} placeholder={nota.cifra} style={{width: "15px", border: "none"}}/>
                                <span
                                    data-corda={ ((index - 6) * -1 )}
                                    data-casa={(indice + this.state.tessitura.inicio) }
                                    data-nota={this.escala.pegaHomonimos(nota.cifra)}
                                ></span>
                            </div>
                        ) : ( (indice + this.state.tessitura.inicio) <= this.state.tessitura.fim ?
     
                            <div key={indice} className="casa">
                                <hr />
                                <span
                                    data-corda={ ((index - 6) * -1)}
                                    data-casa={(indice + this.state.tessitura.inicio) }
                                    data-nota={
                                        this.escala.pegaHomonimos(
                                            corda[ (indice + this.state.tessitura.inicio) % corda.length].cifra
                                        )
                                    }
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