import React, { Component } from 'react';

class Home extends Component {
    constructor() {
        super()
        this.id = JSON.parse(document.querySelector("[data-user]").dataset.user)[0].user_id;

        this.state = {
            estudantes: null
        }
    }

    consultarEstudantes(e) {
        e.preventDefault();

        let token = document.querySelector("input[name=_token]").value;
        let formData = new FormData();
        
        formData.append("id", this.id);
        formData.append("_token", token);
        
        fetch(`/admin`,{
            method: "post",
            body: formData
        })
        .then(r => {
            if(r.ok) {
                return r.json();
            }
        })
        .then(r => {
            this.setState({estudantes: r})
        })
    }

    render() { 
        return ( 
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <h1>Bem-Vindo!</h1>
                            {this.id == 1 ?
                                <div>
                                    <button onClick={(e)=>this.consultarEstudantes(e)} className="btn btn-primary">Estudantes</button>
                                </div>
                            : ''}
                            {this.id == 1 && this.state.estudantes ?
                                this.state.estudantes.map( (estudante, index) => {

                                    return <ul key={index} className="list-group text-left m-2">
                                        <li className="list-group-item list-group-item-primary">Nome: {estudante.name}</li>
                                        <li className="list-group-item">Email: {estudante.email}</li>
                                        
                                        {estudante.resultados.map( (resultado,i)=> {
                                            return <li key={i}  className="list-group-item text-capitalize">
                                                {resultado.exercicio}
                                                <ul>
                                                    <li>Acertos: {resultado.acertos}</li>
                                                    <li>Erros: {resultado.erros}</li>
                                                    <li>concluido: {resultado.concluido}</li>
                                                </ul>
                                            </li>
                                        } )}

                                    </ul>
                                    
                                })
                            : ''}
                        </div>
                    </div>
                </div>
            </div>
         );
    }
}
 
export default Home;