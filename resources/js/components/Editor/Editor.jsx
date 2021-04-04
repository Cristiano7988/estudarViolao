import { Card, Container, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import Braco from '../Braco';

class Editor extends Component {
  constructor() {
    super();
    this.toggleEstado = this.toggleEstado.bind(this);
    this.adicionar = this.adicionar.bind(this);
    this.remover = this.remover.bind(this);
    this.state = {
      afinar: false,
      estender: false,
      contador: [{
        cordas: []
      }],
    }
  }

  toggleEstado(e) {
    const { name } = e.target;
    const novoEstado = {...this.state};

    e.target.classList.toggle(name);
    novoEstado[name] = e.target.classList.contains(name);
    this.setState(novoEstado)
  }

  remover() {
    let contador = this.state.contador;
    if(contador.length > 1) {
      contador.pop();
      this.setState(contador);
    }
  }

  adicionar() {
    const contador = this.state.contador;
    contador.push({ cordas: [] });
    this.setState(contador);
  }

  render() {
    return (
      <Container maxWidth="md" align="center" className="editor">
        <Card className="folder">
          <Typography
            component="h1"
            variant="h4"
            children="Editor"
            gutterBottom
          />
          <Typography
            component="h2"
            variant="h5"
            children="Cifras"
            gutterBottom
          />
          {this.state.contador.map((braco, id) => (
            <div key={id} className="container-braco">
              <Braco
                id={id}
                braco={braco}
                escala={false}
                digitar={true}
                afinar={this.state.afinar}
                estender={this.state.estender}
              />
            </div>
          ))}
          <div className="container-btn">
            <input
              type="button"
              name="estender"
              title="Mudar tamanho do braço"
              className="btn-editor arm"
              onClick={this.toggleEstado}
            />
            <input
              type="button"
              name="afinar"
              title="Habilitar Afinação"
              className="btn-editor hand"
              onClick={this.toggleEstado}
            />
            <span
              title="Remover braço"
              className="btn-editor"
              onClick={this.remover}
            >-</span>
            <span
              title="Adicionar braço"
              className="btn-editor"
              onClick={this.adicionar}
            >+</span>
          </div>
        </Card>
      </Container>
    );
  }
}
 
export default Editor;