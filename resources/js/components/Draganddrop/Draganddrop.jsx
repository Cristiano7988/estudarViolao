import React, { Component } from 'react';
import { Droppable, Draggable } from "react-beautiful-dnd";

const getItemStyle = (isDragging, draggableStyle) => ({
    // change background colour if dragging
    boxShadow: isDragging ? "10px 10px 10px black" : "1px 1px 3px black",

    // styles we need to apply on draggables
    ...draggableStyle
});

class Draganddrop extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return ( 
            <Droppable
                droppableId={this.props.nome}
                direction="horizontal"
            >
                {(provided, snapshot) => (<>
                    <div
                        className={`container-cartas ${this.props.nome} ${snapshot.isDraggingOver ? "dragging" : ''} mb-2`}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {this.props.cartas.length ?
                            this.props.cartas.map( (carta, index) => (
                                index <= (this.props.limite ? this.props.limite : this.props.cartas.length) ?
                                <Draggable
                                    key={carta.key}
                                    draggableId={carta.key}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            className={`carta ${carta.naipe.nome}`}
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps
                                                    .style
                                            )}
                                        >
                                            {this.props.costas ?
                                                <div className="borda">
                                                    &#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;
                                                </div>
                                            : <>
                                                <div className="nota-naipe">
                                                    <span>{carta.cifra}</span>
                                                    <span>{carta.naipe.simbolo}</span>
                                                </div>
                                                <span className="naipe">{carta.naipe.simbolo}</span>
                                                <span className="indice">{parseInt(carta.id) + 1}</span>
                                                <div className="nota-naipe">
                                                    <span>{carta.cifra}</span>
                                                    <span>{carta.naipe.simbolo}</span>
                                                </div>
                                            </>}
                                        </div>
                                    )}
                                </Draggable>
                                : ""
                            ))
                        : this.props.nome == "lixo" ? <div className="m-auto">Descarte aqui</div> : ""}
                        {provided.placeholder}
                    </div>
                </>)}
            </Droppable>
        );
    }
}
 
export default Draganddrop;