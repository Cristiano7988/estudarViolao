import React, { Component } from "react";
import ReactDOM from "react-dom";
import Decifrar from "./Decifrar";

class Sistema extends Component {
    render() {
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">Seja Bem-Vindo!</div>

                            <div className="card-body">
                                Em breve teremos mais novidades por aqui. Fique
                                ligado!
                            </div>

                            <Decifrar />
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
