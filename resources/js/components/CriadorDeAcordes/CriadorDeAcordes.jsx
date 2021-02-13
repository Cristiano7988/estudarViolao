import React, { Component } from 'react';
import Escalas from '../../dados/Escalas';
import Intervalos from '../../dados/Intervalos';

class CriadorDeAcordes extends Component {
    constructor() {
        super();
        this.escala = new Escalas();
        this.intervalo = new Intervalos();
        this.criaAcorde = this.criaAcorde.bind(this)
        this.state = {
            acorde: null,
            erro: false
        }
    }
    
    exibeErro() {
        this.setState({ erro: true })
    }

    limpaErro() {
        this.setState({ erro: false })
    }

    exibeVerificacao(valido) {
        if(valido) {
            this.limpaErro();
            return true
        } else {
            this.exibeErro();
            return false;
        }
    }

    verificaAcorde(input) {
        let nota = /^[A-G]/.test(input);
        let acidente = input.replace(/^[A-G]|[m]/, "")
        let simbolosErrados = /[ac-ln-zA-Z0-9]|[\!\@\$\%\¨\&\*\(\)\_\+\=\{\}\[\]\`\´\^\~\;\:\>\<\.\,\?\/]|[\/\\\]|[\-]/.test(acidente);
        let combinacaoErrada = /#b|b#|m#|mb/.test(acidente);
        
        return !(!nota || simbolosErrados || acidente.replace("m", "").length > 2 || combinacaoErrada )
    }

    criaAcorde(e) {
        e.preventDefault();
        let input = document.querySelector('.find-chord').value;

        let valido = this.verificaAcorde(input);

        valido = !input ? true : valido;
        valido = this.exibeVerificacao(valido);
        
        if(input == "" || !valido) {
            this.setState({acorde: null})
            return false
        }

        let escala = this.escala.formarEscala(input, 1)

        let fundamental = escala.notas[0];
        let terca = escala.notas[2];
        let quinta = escala.notas[4];

        let modo = this.intervalo.classificaIntervalo(fundamental.cifra, terca.cifra);

        let acorde = {
            notas: [fundamental, terca, quinta],
            modo: modo.nome,
            cifra: fundamental.cifra,
            intervalos: [
                modo,
                this.intervalo.classificaIntervalo(terca.cifra, quinta.cifra)
            ]
        }

        this.setState({acorde: acorde})
    }

    render() { 
        return ( 
            <div className="container py-4">
               <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            {this.state.acorde ? (
                                <h1 className="text-capitalize">
                                    Acorde {this.state.acorde.modo}
                                </h1>
                            ) : <span className="text-secondary mb-4">
                                    Insira uma Cifra
                                </span>
                            }
                            <div className="input-group input-group-sm w-25 m-auto">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">
                                        Acorde:
                                    </span>
                                </div>
                                <input
                                    placeholder="Ex.: A"
                                    aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                                    className="form-control find-chord"
                                    type="text"
                                />
                            </div>
                            <div className="text-center p-2">
                                <a
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={ this.criaAcorde }
                                >
                                Verificar
                                </a>
                            </div>
                            {this.state.erro ?
                                <span className="text-danger font-italic">*Acorde não reconhecido</span>
                            :''}
                            {this.state.acorde ?
                                <div className="d-flex justify-content-around pr-5 pl-5 mb-5 mt-5" style={{ background: '#a6540d', borderRadius: '5px'}}>
                                    {this.state.acorde.notas.map( (nota, index)=> {
                                        let intervalo = index >= 2 ? false : true;
                                        return (
                                            <div
                                                className="p-2"
                                                key={index}
                                                style={{position: 'relative'}}
                                            >
                                                <p style={{color: 'white'}}>
                                                    {nota.cifra}
                                                </p>
                                                {intervalo ?
                                                <p
                                                    title={this.state.acorde.intervalos[index].nome}
                                                    style={{position: "absolute", top: '115%',left: "200%", minWidth: "33px"}}
                                                >{this.state.acorde.intervalos[index].valor}</p>
                                                : ""} 
                                            </div>
                                        )
                                    })}
                                </div>
                            : ""}
                        </div>
                    </div>
                </div>                
            </div>
        );
    }
}
 
export default CriadorDeAcordes;