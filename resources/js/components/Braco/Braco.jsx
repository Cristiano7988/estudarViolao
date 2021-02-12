import { remove } from 'lodash';
import React, { Component } from 'react';
import Escalas from '../../dados/Escalas';

class Braco extends Component {
    constructor(props) {
        super(props)
        this.escala = new Escalas()
        this.state = { 
            cordas: [
                this.escala.aumentaUmaOitava(this.escala.formarEscala("E", 0).notas),
                this.escala.aumentaUmaOitava(this.escala.formarEscala("A", 0).notas),
                this.escala.aumentaUmaOitava(this.escala.formarEscala("D", 0).notas),
                this.escala.aumentaUmaOitava(this.escala.formarEscala("G", 0).notas),
                this.escala.aumentaUmaOitava(this.escala.formarEscala("B", 0).notas),
                this.escala.aumentaUmaOitava(this.escala.formarEscala("E", 0).notas)
            ],
            tessitura: {
                inicio: 0,
                fim: 5
            },
            erro: {
                afinacao: false
            },
            notas: []
        }
        this.afina = this.afina.bind(this)
        this.marcar = this.marcar.bind(this)
    }

    componentDidUpdate() {
        // Limpa o braço para poder atualizá-lo em seguida
        document.querySelectorAll(".active").forEach(el=>el.classList.remove("active"));
        if(this.props.digitar) {
            this.props.retomar()
        }
        this.digitaEscala();
    }

    componentDidMount() {
        this.digitaEscala()
    }

    marcar(e) {
        e.preventDefault();
        if(this.props.digitar) {
            let casa = e.target.closest('.casa, .afinacao');
            let braco = e.target.closest('.braco').dataset.id;

            // Salva no componente pai
            this.props.salvar({
                corda: casa.lastChild.dataset.corda,
                casa: casa.lastChild.dataset.casa,
                braco: braco
            })
        }
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
    
            cordas[e.target.dataset.id] = this.escala.aumentaUmaOitava(this.escala.formarEscala(e.target.value, 0).notas);
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
                <input type="text" style={{border: "none"}} placeholder="Nome" className="text-center cifra" />
            </div>
        :""}
        {this.state.erro.afinacao ?
            <i className="text-danger">Nota inválida</i>
        : ''}
        <div className="d-flex justify-content-center">
        {!this.props.estender ?
            <div className={`d-flex flex-column ${this.props.afinar ? "pt-5" : "pt-4"}`}>
                <p>{this.state.tessitura.inicio + 1}ª</p>
                <div className="d-flex flex-column align-items-center">
                    <i className="seta up" onClick={(e)=>this.mudaPosicao(0)}></i>
                    <i className="seta down" onClick={(e)=>this.mudaPosicao(1)}></i>
                </div>
            </div>
            : ""}
            <div className="braco" data-id={this.props.id}>
                {this.state.cordas.map( (corda,index) =>{
                    let posicao = ((index - 6) * -1 );

                    return <div key={index} className={`corda corda-${posicao}`}>{corda.map( (nota, indice)=> {
                        let inicio = this.props.estender ? indice  : indice + this.state.tessitura.inicio;
                        let final = this.props.estender ? 16 : this.state.tessitura.fim;

                        return indice == 0 ? (
                            <div key={indice} className="afinacao" style={{cursor: this.props.digitar ? "pointer" : "unset"}}>
                                {this.props.afinar ?
                                    <input type="text" title="Clique para editar a afinação" onChange={this.afina} data-id={index} placeholder={nota.cifra} style={{width: "15px", border: "none"}}/>
                                : ''}
                                <span
                                    data-corda={posicao}
                                    data-casa={indice}
                                    data-nota={this.escala.pegaHomonimos(nota.cifra)}
                                    onClick={this.marcar}
                                ></span>
                            </div>
                        ) : ( inicio <= final ?
     
                            <div key={indice}
                                className="casa"
                                style={{cursor: this.props.digitar ? "pointer" : "unset"}}
                                onClick={this.marcar}
                            >
                                <hr />
                                <span
                                    data-corda={posicao}
                                    data-casa={(inicio)}
                                    data-nota={
                                        this.escala.pegaHomonimos(
                                            corda[inicio % corda.length].cifra
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