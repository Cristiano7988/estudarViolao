import React from 'react';
import ReactDOM from 'react-dom';

function Sistema() {
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">Seja Bem-Vindo!</div>

                        <div className="card-body">Em breve teremos mais novidades por aqui. Fique ligado!</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sistema;

if (document.getElementById('Sistema')) {
    ReactDOM.render(<Sistema />, document.getElementById('Sistema'));
}
