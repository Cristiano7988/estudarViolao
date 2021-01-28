import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 ${grid}px 0 0`,
    borderWidth: "thin",
    borderStyle: "solid",
    borderRadius: "5px",

    // change background colour if dragging
    borderColor: isDragging ? "#3490dc" : "grey",

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    borderColor: isDraggingOver ? "#3490d" : "lightgrey",
    borderWidth: "thin",
    borderStyle: "solid",
    borderRadius: "5px",
    display: "flex",
    padding: grid,
    paddingRight: 0,
    overflow: "auto"
});

class Ordenar extends Component {
    render() {
        return (
            <div>
                <h2>Escala {this.props.modo}</h2>
                <div className="d-flex justify-content-center mt-5">
                    <DragDropContext onDragEnd={this.props.onDragEnd}>
                        <Droppable
                            droppableId="droppable"
                            direction="horizontal"
                        >
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    style={getListStyle(
                                        snapshot.isDraggingOver
                                    )}
                                    {...provided.droppableProps}
                                >
                                    {this.props.escala.map((item, index) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps
                                                            .style
                                                    )}
                                                >
                                                    {item.cifra}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
                <div className="mb-5">
                    <em>Arraste a nota para posição correta</em>
                </div>
            </div>
        );
    }
}

export default Ordenar;
