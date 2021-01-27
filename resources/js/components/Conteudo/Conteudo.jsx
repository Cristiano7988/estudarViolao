import React, { Component } from 'react';
import Escalas from "../../dados/Escalas";

class Conteudo extends Component {
    constructor() {
        super()
        this.escala = new Escalas();
        this.state = {
            escala: null,
            erro: false
        }
    }

    geraEscala(e) {
        let escala;
        switch (e.target.value) {
            case '':
                this.setState({erro: false, escala: null})
                break;
        
            default:
                escala = this.escala.maior(e.target.value),
                escala
                    ? this.setState({ erro: false, escala: escala })
                    : this.setState({ erro: true, escala: null })
                break;
        }

        
    }

    render() {
        return ( 
            <div className="container py-4">
               <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <h1>Escala Maior</h1>
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
                                    onChange={ (e)=> this.geraEscala(e) }
                                />
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