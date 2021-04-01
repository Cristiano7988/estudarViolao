import React, { Component } from 'react';
import Braco from '../Braco';

class Editor extends Component {
    constructor() {
        super();
        this.afinar = this.afinar.bind(this);
        this.remover = this.remover.bind(this);
        this.adicionar = this.adicionar.bind(this);
        this.estender = this.estender.bind(this);
        this.state = {
            contador: [{
                cordas: []
            }],
            afinar: false,
            estender: false,
        }
    }

    estender(e) {
        e.preventDefault();
        e.target.classList.toggle('estender')
        this.setState({estender: e.target.classList.contains('estender')})
    }

    afinar(e) {
        e.preventDefault();
        e.target.classList.toggle('afinar')
        this.setState({afinar: e.target.classList.contains('afinar')})
    }

    remover(e) {
        e.preventDefault();
        let contador = this.state.contador;
        if(contador.length > 1) {
            contador.pop();
            this.setState(contador);
        }
    }

    adicionar(e) {
        e.preventDefault();
        const contador = this.state.contador;
        contador.push({ cordas: [] });
        this.setState(contador);
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
                                {this.state.contador.map((braco, id)=>{
                                    return (
                                        <div key={id}>
                                            <Braco
                                                id={id}
                                                braco={braco}
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