import React, { Component } from 'react';
import Braco from '../Braco';

class Editor extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <h1>Editor de Cifras</h1>
                            <div>
                                <input type="text" style={{border: "none"}} placeholder="Nome" className="text-center" />
                            </div>
                            <Braco escala={false} digitar={true}/>
                        </div>
                    </div>
                </div>
            </div>
         );
    }
}
 
export default Editor;