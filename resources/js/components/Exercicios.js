import React, { Component } from "react";
import Decifrar from "./Decifrar";
import Ordenar from "./Ordenar";

export default class Exercicios extends Component {
    render() {
        return (
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <h1>Exercicios</h1>
                            {this.props.match.params.exercicio == "ordenar" ? <Ordenar /> : ""}
                            {this.props.match.params.exercicio == "decifrar" ? <Decifrar usuario={JSON.parse(document.querySelector('[data-user]').dataset.user)} /> : ""}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}