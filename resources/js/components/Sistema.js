import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Switch, Route, BrowserRouter, Link } from "react-router-dom";
import Exercicios from "../components/Exercicios";
import Home from "./Home";

class Sistema extends Component {
    render() {
        return (
            <BrowserRouter>
                <div style={{ background: "currentColor" }}>
                    <nav className="navbar">
                        <ul className="nav container justify-content-start">
                            <li className="nav-item">
                                <Link to="/home" className="nav-link">
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item dropdown">
                                <a
                                    id="dLabel"
                                    className="nav-link dropdown-toggle"
                                    type="button"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    Exercicios
                                </a>
                                <ul className="dropdown-menu exercicios" style={{background: "currentColor"}}>
                                    <li className="nav-item dropdown-item">
                                        <Link
                                            className="nav-link"
                                            to="/exercicios/ordenar">
                                            Ordenar
                                        </Link>
                                    </li>
                                    <li className="nav-item dropdown-item ">
                                        <Link
                                            className="nav-link"
                                            to="/exercicios/decifrar"
                                        >
                                            Decifrar
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>
                <Switch>
                    <Route path="/home" exact={true} component={Home} />
                    <Route
                        path="/exercicios/:exercicio"
                        component={Exercicios}
                    />
                </Switch>
            </BrowserRouter>
        );
    }
}

export default Sistema;

if (document.getElementById("Sistema")) {
    ReactDOM.render(<Sistema />, document.getElementById("Sistema"));
}
