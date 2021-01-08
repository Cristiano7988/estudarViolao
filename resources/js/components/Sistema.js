import React, { Component } from "react";
import ReactDOM from "react-dom";
import Decifrar from "./Decifrar";
import Ordenar from "./Ordenar";

class Sistema extends Component {
    render() {
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <h1>Bem-Vindo!</h1>
                            <Decifrar
                                usuario={JSON.parse(document.querySelector('[data-user]').dataset.user)}
                            />
                            <Ordenar />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Sistema;

if (document.getElementById("Sistema")) {
    ReactDOM.render(<Sistema />, document.getElementById("Sistema"));
}
