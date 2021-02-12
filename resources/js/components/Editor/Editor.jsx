import React, { Component } from 'react';
import Braco from '../Braco';

class Editor extends Component {
    constructor() {
        super();
        this.retomar = this.retomar.bind(this)
        this.salvar = this.salvar.bind(this);
        this.afinar = this.afinar.bind(this);
        this.remover = this.remover.bind(this);
        this.adicionar = this.adicionar.bind(this);
        this.estender = this.estender.bind(this);
        this.state = {
            contador: [''],
            afinar: false,
            estender: false,
            marcadas: []
        }
    }

    componentDidUpdate() {
        this.retomar()
    }

    verificaSaves(nota) {
        let marcadas = this.state.marcadas

        let desmarcar = this.state.marcadas.findIndex(marcadas=> {
            return (
                marcadas.corda == nota.corda &&
                marcadas.nota == nota.nota &&
                marcadas.braco == nota.braco
            )
        })

        if(desmarcar > -1) {
            marcadas.splice(desmarcar, 1)
            this.setState({marcadas: marcadas})
            return true
        }
    }

    salvar(notas) {

        if(this.verificaSaves(notas)) {
            return false
        }

        let marcadas = this.state.marcadas
        marcadas.push(notas)
        this.setState({marcadas: marcadas})
    }

    retomar() {
        this.state.marcadas.forEach(posicao=> {
            let elemento = document.querySelector(`[data-id="${posicao.braco}"] [data-corda="${posicao.corda}"][data-nota="${posicao.nota}"]`)
            elemento ? elemento.classList.add('active') : ''

            let input = document.querySelector(`[data-input="${posicao.braco}"]`)
            input ? input.value = posicao.cifra: ''
        })

        return this.state.marcadas
    }

    estender(e) {
        e.preventDefault();
        e.target.classList.toggle('estender')
        this.setState({estender: e.target.classList.contains('estender')})
        this.retomar();
    }

    afinar(e) {
        e.preventDefault();
        e.target.classList.toggle('afinar')
        this.setState({afinar: e.target.classList.contains('afinar')})
    }

    remover(e) {
        e.preventDefault();
        let remove = this.state.contador
        if(remove.length > 1) {
            remove.splice(remove.length - 1, 1)
            this.setState({contador: remove})
        }
    }

    adicionar(e) {
        e.preventDefault();
        let adiciona = this.state.contador
        adiciona.push('')
        this.setState({contador: adiciona})
    }

    render() {
        return (
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <div className="card text-center">
                            <h1 className="m-5">Editor</h1>
                            <h2 className="mb-5">Cifras</h2>
                            <div className="row m-auto pb-5">
                                {this.state.contador.map((b, id)=>{
                                    return (
                                        <div key={id}>
                                            <Braco
                                                id={id}
                                                notas={this.state.marcadas}
                                                retomar={this.retomar}
                                                salvar={this.salvar}
                                                escala={false}
                                                digitar={true}
                                                afinar={this.state.afinar}
                                                estender={this.state.estender}
                                            />
                                        </div>
                                    )
                                })}
                                <div>
                                    <div className="container-btn">
                                        <span className="btn-editor arm" onClick={this.estender}></span>
                                        <span className="btn-editor hand" onClick={this.afinar}></span>
                                        <span className="btn-editor" onClick={this.remover}>-</span>
                                        <span className="btn-editor" onClick={this.adicionar}>+</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         );
    }
}
 
export default Editor;