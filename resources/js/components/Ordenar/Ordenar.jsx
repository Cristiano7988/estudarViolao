import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Escalas from "../../dados/Escalas";

function mudarPosicao(array) {
    let de = parseInt(0 + Math.random() * (array.length - 0));
    let para = parseInt(0 + Math.random() * (array.length - 0));
    array.splice(para, 0, array.splice(de, 1)[0]);
    return array;
}

const getItems = () => {
    let escala = new Escalas().nova.map((nota, i) => ({
        id: `${i}`,
        content: `${nota.cifra}`
    }));

    return mudarPosicao(escala);
};

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

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
    constructor(props) {
        super(props);
        this.escala = new Escalas();
        this.state = {
            items: getItems(),
            respostaCerta: false,
            respondido: false,
            mensagemErro: null
        };
        this.onDragEnd = this.onDragEnd.bind(this);
        this.escala = new Escalas();
    }

    onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items = reorder(
            this.state.items,
            result.source.index,
            result.destination.index
        );

        document.querySelectorAll(".errado").forEach(div => div.classList.remove("errado"));

        this.setState({
            items
        });
    }

    verificaOrdem() {
        if (!this.state.respondido) {
            let ordem = [];
            let resultado = true;
            let id = "data-rbd-draggable-id";

            document.querySelectorAll(`[${id}]`).forEach(item => {
                ordem.push(item.dataset.rbdDragHandleDraggableId);
            });

            ordem.forEach((posicao, i) => {
                if (posicao != i) {
                    document.querySelector(`[${id}="${posicao}"]`).classList.add("errado");
                    resultado = false;
                }
            });
            this.setState({
                respostaCerta: resultado,
                respondido: true,
                mensagemErro: null
            });
        } else {
            this.setState({ mensagemErro: "Pergunta já respondida" });
        }
    }

    proximaQuestao() {
        this.state.respondido
            ? (this.setState({
                  items: getItems(),
                  mensagemErro: null,
                  respondido: null,
                  respostaCerta: null
              }),
              document.querySelectorAll(".errado").forEach(div => div.classList.remove("errado")))
            : this.setState({ mensagemErro: "Responda a Pergunta" });
    }

    render() {
        return (
            <div>
                <p>Ordene as notas para formar uma escala maior</p>
                <div className="d-flex justify-content-center mb-2">
                    <DragDropContext onDragEnd={this.onDragEnd}>
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
                                    {this.state.items.map((item, index) => (
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
                                                    {item.content}
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
                {this.state.respostaCerta && this.state.respondido ? (
                    <div className="alert alert-success">
                        <p>Resposta Certa</p>
                    </div>
                ) : (
                    ""
                )}
                {!this.state.respostaCerta && this.state.respondido ? (
                    <div className="alert alert-danger">
                        <p>Resposta errada</p>
                    </div>
                ) : (
                    ""
                )}
                <div className="mb-2">
                    <button
                        className="btn btn-primary"
                        onClick={this.verificaOrdem.bind(this)}
                    >
                        Verificar
                    </button>
                    {this.state.mensagemErro ? (
                        <p className="text-danger">{this.state.mensagemErro}</p>
                    ) : (
                        ""
                    )}
                </div>
                <div>
                    <button
                        className="btn btn-outline-primary"
                        onClick={this.proximaQuestao.bind(this)}
                    >
                        Próximo
                    </button>
                </div>
            </div>
        );
    }
}

export default Ordenar;
