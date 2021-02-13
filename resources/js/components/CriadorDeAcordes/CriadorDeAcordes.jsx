import React, { Component } from 'react';
import Escalas from '../../dados/Escalas';

class CriadorDeAcordes extends Component {
    constructor() {
        super();
        this.escala = new Escalas();
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

    comparar(nota1, nota2) {
        var cromatica = this.escala.formarEscala(nota1, 0)
        
        var cromatica2 = this.escala.formarEscala(nota2, 0)

        let homonimos1 = this.escala.pegaHomonimos(nota1)
        let homonimos2 = this.escala.pegaHomonimos(nota2)
        
        // pega a posição dos homonimos da escala diatonica na escala cromatica
        let index = cromatica.notas.findIndex( nota=> new RegExp(`\\[${nota.cifra}\\]`).test(homonimos1) )
        let index2 = cromatica.notas.findIndex( nota=> new RegExp(`\\[${nota.cifra}\\]`).test(homonimos2) )
       
        let diatonica = this.escala.aumentaUmaOitava(this.escala.diatonica.notas);

        let id = diatonica.findIndex(nota=>nota.cifra==nota1[0]);
        let id2 = diatonica.findIndex(nota=>nota.cifra == nota2[0]);

        // Calculo distancia entre as notas
        let distancia = {}

        distancia.diatonica = id2 - id;
        distancia.cromatica = index2 - index

        if(index2 == -1) {
            index = cromatica2.notas.findIndex( nota=> new RegExp(`\\[${nota.cifra}\\]`).test(homonimos1) )
            index2 = cromatica2.notas.findIndex( nota=> new RegExp(`\\[${nota.cifra}\\]`).test(homonimos2) )
        }
         
        // Calculo para 2 oitavas
        if(distancia.cromatica < 0) {
            distancia.cromatica = ((index2 + 12) - index) % 13
        }
        if(distancia.diatonica < 0 ) {
            distancia.diatonica = ( (id2 + 7) - id ) % 9
        }

        let soma = distancia.cromatica * 0.5
        
        switch (distancia.diatonica) {
            case 1:
                return this.segunda(soma, "segunda");
            case 2:
                return this.terca(soma, "terça")
            default:
                break;
        }
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

        let modo = this.comparar(fundamental.cifra, terca.cifra);

        let acorde = {
            notas: [fundamental, terca, quinta],
            modo: modo.nome,
            cifra: fundamental.cifra,
            intervalos: [
                modo,
                this.comparar(terca.cifra, quinta.cifra)
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