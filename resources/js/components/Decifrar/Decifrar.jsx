import React, { Component } from "react";

const getLimite = subNivel => {
    return subNivel == 0 ? 2 : subNivel == 1 ? 1 : 0;
};
class Decifrar extends Component {
    constructor(props) {
        super(props);
        this.subNivel = this.props.sub_nivel;
    }

    render() {
        return (
            <ul className="list-group">
                {this.props.escala.map((nota, index) => {
                    let limite = getLimite(this.subNivel);

                    return index <= limite ? (
                        <li key={index} className="list-group-item">
                            <div className="row d-flex justify-content-center align-items-center">
                                <span className="col-3">{nota.nome}</span>
                                <span>=</span>
                                <span className="col-3">
                                    {index == limite ? (
                                        <div className="input-group">
                                            <input
                                                data-resposta={nota.cifra}
                                                type="text"
                                                className="form-control text-center resposta text-capitalize"
                                                placeholder="?"
                                            />
                                        </div>
                                    ) : (
                                        nota.cifra
                                    )}
                                </span>
                            </div>
                        </li>
                    ) : (
                        ""
                    );
                })}
            </ul>
        );
    }
}

export default Decifrar;
