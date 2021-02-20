import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Escalas from '../../dados/Escalas';
import Intervalos from '../../dados/Intervalos';

const copiarObj = (obj) => JSON.parse(JSON.stringify(obj));

const getUser = (exercicio, item) => {
    let resultados = JSON.parse(document.querySelector("[data-usuario]").dataset.usuario);

    let resultados_exercicio = resultados.find(resultado=> {return resultado.exercicio === exercicio})
    return resultados_exercicio[item];
};

const getItemStyle = (isDragging, draggableStyle) => ({
    // change background colour if dragging
    boxShadow: isDragging ? "10px 10px 10px black" : "1px 1px 3px black",

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = (isDraggingOver, turno) => ({
    background: isDraggingOver ? "lightblue" : turno ? "aliceblue" : "unset"
});

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

class Cartas extends Component {
    constructor() {
        super();
        this.escala = new Escalas();
        this.intervalo = new Intervalos();
        this.passaVez = this.passaVez.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.comecar = this.comecar.bind(this);
        this.state = {
            adversario: null,
            acertos: getUser('cartas', 'acertos'),
            erros: getUser('cartas', 'erros'),
            concluido: parseInt(getUser('cartas', 'concluido')),
            porcentagem: 0,
            tonalidade: null,
            baralho: null,
            jogador: null,
            maquina: null,
            lixo: [],
            turno: true,
            comprou: false,
            largou: false,
            status: false,
            mensagem: false
        },
        this.naipes = {
            ouros: String.fromCharCode(9830),
            paus: String.fromCharCode(9827),
            copas: String.fromCharCode(9829),
            espadas: String.fromCharCode(9824)
        }
    }

    componentDidMount() {
        this.comecar();
        this.setState({ porcentagem: this.porcentagem() });
    }

    getResultados(id_exercicio) {
        fetch(`/resultados/${id_exercicio}`, {
            method: "get",
        })
        .then(r=>{
            if(r.ok) {
                return r.json();
            }
        }).then(r=>{
            if(this.state.acertos != r.acertos || this.state.erros != r.erros) {
                this.setState({
                    acertos: r.acertos,
                    erros: r.erros,
                    concluido: parseInt(getUser("cartas", "concluido"))
                })
            }
            if(this.state.porcentagem == "100%" && !this.state.concluido) {
                fetch(`/conclui/${getUser("cartas", "id")}`)
                this.setState({concluido: true})
            }
        })
    }

    comecar() {
        this.geraBaralho();
        
        let adversarios = [
            "Miles Davis",
            "Johnny Ramone",
            "Santana",
            "Kurt Cobain",
            "Shakira",
            "Madonna",
            "Tom Jobim",
            "J.S. Bach",
            "Anitta",
            "Bobby McFerrin"
        ];

        let random = parseInt(0 + Math.random() * (adversarios.length - 0))
        this.setState({
            status: false,
            turno: true,
            adversario: adversarios[random]
        })

        setTimeout(()=>this.setState({mensagem: "Forme 2 acordes (tríades) para vencer o jogo"}), 1000 )
        setTimeout(()=>this.setState({mensagem: false }), 5000 )
        setTimeout(()=>this.setState({mensagem: "Os acordes devem ser do mesmo naipe!"}), 6000 )
        setTimeout(()=>this.setState({mensagem: false }), 10000 )
    }

    componentDidUpdate() {
        if(this.state.status) {
            return;
        }
        if(this.state.comprou && this.state.largou && !this.state.turno) {
            this.passaVez();
        }
    }

    separa(lista, excluir) {
        let novas=[];

        excluir = excluir.length > 0 ? excluir[0] : excluir;

        var fora = lista.map( item => {
            if(item.key != excluir.key) {
                novas.push(item);
            } else {
                return item;
            }
        })

        // Junta o que tem q colocar fora com o que tá fora
        let descarta = this.state.lixo
        descarta.unshift(fora.filter(Boolean)[0])

        setTimeout(
            ()=>
                this.setState({
                    maquina: novas,
                    lixo: descarta,
                    largou: false,
                    comprou: false,
                    turno: true
                }),
            1000
        )

        return fora.filter(Boolean) ? true : false;
    }

    registraResultado(status, mensagens) {
        let random = parseInt(0 + Math.random() * (mensagens.length - 0))

        this.setState({
            status: status,
            mensagem: mensagens[random],
            turno: false,
            adversario: false,
            porcentagem: this.porcentagem()
        })

        if(status == "Empatou") return;

        let token = document.querySelector("input[name=_token]").value;
        let formData = new FormData();

        formData.append("id", getUser("cartas", "user_id"));
        formData.append("resultado", status == "Você Ganhou" ? 1 : 0);
        formData.append("_token", token);
        formData.append("exercicio", "cartas");

        fetch("/salvar-resultado", {
            method: "post",
            body: formData
        }).then((r)=> {
            return r.json();
        }).then(r=>{
        })
    }

    descarta(jogadas) {
        var novas = [];
        var descartaveis = [];
        var maquinaJogou = false;

        // Verifica se a jogada possui um acorde em potencial
        // E separa esse acorde das outras cartas
        let acordes =
        jogadas.map( (jogada, indice) => {
            let resultado = jogada.map( nota => {
                let proximo = (indice + 1) % jogada.length;
                let ultimo = (indice + 2) % jogada.length;
    
                let resultado = this.verificaTriade(
                    this.intervalo.classificaIntervalo(nota.cifra, jogada[proximo].cifra),
                    this.intervalo.classificaIntervalo(jogada[proximo].cifra, jogada[ultimo].cifra)
                );

                if(resultado) {
                    let acorde = [
                        nota,
                        jogada[proximo],
                        jogada[ultimo]
                    ];
                    return acorde;
                }
                return resultado;
            })

            if(resultado.filter(Boolean)[0]) {
                return resultado.filter(Boolean)[0];
            }
        })

        acordes = acordes.filter(Boolean)

        jogadas.map( jogada => {
            !acordes.length ? descartaveis.push(jogada) : ''
            
            let sobras = jogada.map(carta=>{
                let sobras = acordes.map(acorde=> {
                    if(acorde.includes(carta)) {
                        return false;
                    } else {
                        return carta;
                    }
                })

                if(sobras.length) {
                    return sobras.filter(Boolean)[0];
                }
            })

            sobras = sobras.filter(Boolean)

            if(sobras) {
                descartaveis.push(sobras)
            }
        })

        if(acordes.length == 2) {
            this.separa(this.state.maquina, descartaveis[0])
            let mensagens = [
                "Que pena!\nMas veja pelo lado bom,\nagora você tem um motivo pra uma melodia\ne outro motivo pra jogar! ;)",
                "Puxa!\nJá que não deu pra ganhar...\nserá que dá pra fazer um som com elas?",
                "Ah que droga!!\nTava tão perto, né?\nAcho que se você tentar de novo você consegue!",
                "Aff!!\nTalvez seja mais fácil tocar elas no violão",
                "Que coisa, né!?\nTudo bem, quem sabe tocar essas notas te ajude na próxima"
            ];

            this.registraResultado("Você perdeu", mensagens)
            return;
        }


        // Exclui se a jogada tiver duas cartas com notas e naipes iguais
        // (Independente de quantas cartas tenha na jogada)
        descartaveis.map( jogada => {   
            novas=[];
            
            var repetida = jogada.find( (nota, i) => {
                if(jogada.length > 1) {
                    let proxima = (i + 1) % jogada.length;
                    let intervalo = this.intervalo.classificaIntervalo(nota.cifra, jogada[proxima].cifra)
                    if(intervalo.prefixo == "oitava") {
                        return nota;
                    }
                }
            })

            if(repetida != undefined) {
                this.separa(this.state.maquina, repetida)
                maquinaJogou = true
            }
        })

        // Exclui a carta que estiver em um intervalo de segunda ou sétima
        // Se a jogada tiver 2 ou 3 cartas
        if(!maquinaJogou) {
            descartaveis.map( jogada => {   
                novas=[];

                let ruim = jogada.find( (nota, i) => {
                    let intervalo = this.intervalo.classificaIntervalo(nota.cifra, jogada[(i + 1) % jogada.length].cifra)
                    
                    if( intervalo.prefixo == "segunda" || intervalo.prefixo == "setima") {
                        return nota;
                    }
                })

                if(ruim != undefined) {
                    this.separa(this.state.maquina, ruim)
                    maquinaJogou = true
                }
            })  
        }

        // Exclui o jogo que tiver uma carta
        if(!maquinaJogou) {
            descartaveis.map( jogada => {   
                novas=[];

                if(jogada.length == 1) {
                    this.separa(this.state.maquina, jogada[0])
                    maquinaJogou = true
                }
            })  
        }

        // Exclui uma carta qualquer, pra evitar de ficar com 7 cartas
        if(!maquinaJogou) {
            descartaveis.map( jogada => {   
                novas=[];

                if(jogada.length) {
                    this.separa(this.state.maquina, jogada[0])
                    maquinaJogou = true
                }
            })  
        }
    }

    separaNaipes(maquina) {
        var novas = [];

        // Agrupa as notas por naipes
        var ouros = [], espadas = [], copas = [], paus = [];        
        maquina.map( nota => {
            this.naipes.ouros == nota.naipe.simbolo ? ouros.push(nota) : ''
            this.naipes.espadas == nota.naipe.simbolo ? espadas.push(nota) : ''
            this.naipes.copas == nota.naipe.simbolo ? copas.push(nota) : ''
            this.naipes.paus == nota.naipe.simbolo ? paus.push(nota) : ''
        })

        var jogadas = [ouros, espadas, copas, paus];

        // salva as notas
        jogadas.map( jogada => {
            jogada.map( nota => novas.push(nota))
        })
        setTimeout(
            ()=>
                this.setState({maquina: novas }, ()=> this.descarta(jogadas)),
            1000
        )
    }

    pegaCarta(maquina) {
        // Pega uma carta do baralho
        let baralho = this.state.baralho;

        maquina.push(baralho.slice(0, 1)[0]);
        baralho = baralho.slice(1);

        setTimeout(
            ()=>
                this.setState({
                    baralho: baralho,
                    maquina: maquina,
                    turno: false
                }, ()=> this.separaNaipes(maquina)),
            500
        )
    }

    passaVez() {
        if(!this.state.baralho.length) {
            let mensagens = [
                "Ué?!\nUma dica boa pra ganhar é:\nDescarte primeiro as notas iguais de naipes iguais\nDepois as notas de naipes iguais, mas em intervalo de segunda\nou seja, que o número seja subsequente",
                "Xii!\nFicou na dominante e não resolveu rsrs",
                "Mas que coisa?\nSerá que dá pra aproveitar as notas pelo menos\npra fazer uma música?"
            ];
    
            this.registraResultado("Empatou", mensagens)
            return;
        }

        this.setState({
            comprou: false,
            largou: false
        }, ()=> this.pegaCarta(this.state.maquina) )
    }

    verificaTriade(modo, quinta) {
        let jogo = false;

        if (modo.prefixo == "terça" && quinta.prefixo == "terça") {
            jogo = true
        }
        if (modo.prefixo == "sexta" && quinta.prefixo == "sexta") {
            jogo = true
        }
        if (modo.prefixo == "quarta" && quinta.prefixo == "terça" ||
            modo.prefixo == "terça" && quinta.prefixo == "quarta") {
            jogo = true
        }
        if (modo.prefixo == "sexta" && quinta.prefixo == "quinta" ||
            modo.prefixo == "quinta" && quinta.prefixo == "sexta") {
            jogo = true
        }

        return jogo;
    }

    verificaResposta(notas) {
        if( !(notas[0].naipe.nome == notas[1].naipe.nome && notas[1].naipe.nome == notas[2].naipe.nome) ) {
            return;
        }
        if( !(notas[3].naipe.nome == notas[4].naipe.nome && notas[4].naipe.nome == notas[5].naipe.nome) ) {
            return;
        }
        if(notas.length != 6) {
            return;
        }
        
        let jogo1 =
            this.verificaTriade(
                this.intervalo.classificaIntervalo(notas[0].cifra, notas[1].cifra),
                this.intervalo.classificaIntervalo(notas[1].cifra, notas[2].cifra)
            );
        
        let jogo2 =
            this.verificaTriade(
                this.intervalo.classificaIntervalo(notas[3].cifra, notas[4].cifra),
                this.intervalo.classificaIntervalo(notas[4].cifra, notas[5].cifra)
            );

        if(jogo1 && jogo2) {
            let mensagens = [
                "Parabéns!\nAgora experimente tocar o som das tuas cartas\ne das cartas do seu oponente!",
                "Muito bem!\nCombinação interessante de notas, né?\nQue tal fazer uma música usando elas?",
                "Arrasou!!\nTu sabe qual é o nome desses acordes?\nQueres que eu te conte?",
                "Aaaeeeww!!\nAgora experimente jogar com o violão junto.\nA cada jogada faça um improviso usando as notas como tema!",
                "Isso aí! Mandou bem!\nDois acordes bem básicos,\nmas se tu enxergar todas as cartas como um acorde,\nque acorde que fica?"
            ];

            this.registraResultado("Você Ganhou", mensagens);
            return;
        }
    }

    /**
     * A semi-generic way to handle multiple lists. Matches
     * the IDs of the droppable container to the names of the
     * source arrays stored in the state.
     */
    id2List = {
        usuario: 'jogador',
        baralho: 'baralho',
        lixo: 'lixo'
    };

    getList = id => this.state[this.id2List[id]];

    onDragEnd = result => {
        try {
            if(!this.state.turno) {
                this.setState({mensagem: "Espere a sua vez"})
                return;
            }

            this.setState({mensagem: false})

            const { source, destination } = result;
    
            if(source.droppableId == "usuario" && destination.droppableId == "lixo") {
                destination.index = 0;
            }
        
    
            // dropped outside the list
            if (!destination) {
                return;
            }
    
            if (source.droppableId === destination.droppableId) {
                const jogador = reorder(
                    this.getList(source.droppableId),
                    source.index,
                    destination.index
                );
    
                if (source.droppableId === 'usuario') {
                    this.setState({jogador}, ()=>this.verificaResposta(jogador));
                }
    
            } else {
    
                const result = move(
                    this.getList(source.droppableId),
                    this.getList(destination.droppableId),
                    source,
                    destination
                );
    
                if(this.state.jogador.length >= 7 && destination.droppableId != "lixo") {
                    this.setState({mensagem: "Você precisa largar uma carta"})
                    return;
                }

                if(this.state.largou && source.droppableId == "lixo") {
                    this.setState({mensagem: "Não é possível recuperar esta carta"})
                    return;
                }
    
                if(destination.droppableId == "baralho") {
                    this.setState({mensagem: 'Deste baralho você só pode retirar cartas' })
                    return;
                }
    
                if(source.droppableId == "baralho" || source.droppableId == "lixo") {
                    if(this.state.comprou) {
                        this.setState({mensagem: "Você já pegou uma carta"})
                        return;
                    }
                }
    
                if(source.droppableId == "baralho" && destination.droppableId == "lixo") {
                    this.setState({mensagem: 'Seu jogo são as cartas abaixo'})
                    return;
                }
    
                if(source.droppableId == "baralho" && destination.droppableId == "usuario") {
                    this.setState({
                        jogador: result.usuario,
                        baralho: result.baralho,
                        comprou: true
                    }, ()=>this.state.comprou && this.state.largou ? this.setState({turno: false}) : "");
                }
                
                if(source.droppableId == "lixo") {
                    if(this.state.jogador.length == 6 || this.state.jogador.length == 7 ) {
                        this.setState({
                            jogador: result.usuario,
                            lixo: result.lixo,
                            comprou: true
                        }, ()=> {
                            if(this.state.largou && this.state.comprou) {
                                this.setState({turno: false})
                            }
                            this.verificaResposta(result.usuario)
                        });
                    }
                    if(this.state.jogador == 5) {
                        this.setState({mensagem: "Pegue uma carta do baralho à esquerda"})
                    }
    
                }
                if(destination.droppableId == "lixo") {
                    if(this.state.jogador.length < 6) {
                        this.setState({mensagem: "Você precisa pegar uma carta do baralho à esquerda antes"});
                        return;
                    }
                    this.setState({
                        jogador: result.usuario,
                        lixo: result.lixo,
                        largou: true
                    }, ()=> {
                        if(this.state.largou && this.state.comprou) {
                            this.setState({turno: false})
                        }
                        this.verificaResposta(result.usuario)
                    });
                }
            }
        } catch (error) {
            
        }
    };

    embaralha(baralho) {
        var m = baralho.length, t, i;

        while (m) {
            i = Math.floor(Math.random() * m--);

            t = baralho[m]
            baralho[m] = baralho[i]
            baralho[i] = t
        }

        return baralho;
    }

    geraBaralho() {
        var tonalidade = this.escala.geraEscalaAleatoria();
        this.escala.aumentaUmaOitava(tonalidade.notas)

        var baralho = [];

        Object.keys(this.naipes).forEach( (nome, index) => {
            let notas = copiarObj(tonalidade).notas;
            notas.map(nota=> {
                nota.naipe = {
                    nome: nome,
                    simbolo: Object.entries(this.naipes)[index][1]
                }
            }
            )
            baralho.push(...notas)
        })

        baralho = this.embaralha(baralho);

        baralho.map( (carta, index) => carta.key = index.toString() )

        let jogador = baralho.slice(0, 6);
        baralho = baralho.slice(jogador.length, baralho.length)

        let maquina = baralho.slice(0, 6);
        baralho = baralho.slice(maquina.length, baralho.length)

        this.setState({
            tonalidade: tonalidade.notas,
            baralho: baralho,
            jogador: jogador,
            maquina: maquina
        })
    }

    porcentagem() {
        let acertos = parseInt(this.state.acertos);
        let erros = parseInt(this.state.erros);

        let total = (acertos - erros) * 10;

        total = total <= 0 ? "0%" : total + "%";

        return total;
    }

    classeInsignia() {
        let nome = getUser("cartas", "insignia");

        return nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]|[^a-z]/g, "");
    }

    citacao(insignia) {
        switch (insignia) {
            case "guidodarezzo":
                return `"Benedito Guido d'Arezzo foi (...) o inventor inconsciente dos nomes atuais dos sons,\npor ter se utilizado (...) das silabas Ut Re Mi Fa Sol La, tiradas da abertura de cada\nhemistíquio do Hino a São João Batista"\n\nANDRADE, Mário de. Pequena História da Música.`

            case "pitagoras":
                return `"O advento da escala (...) diatônica está historicamente associado ao\nfilósofo e matemático grego Pitágoras (...).\n\nA partir da experiência de subdivisão da corda de um monocórdio, (...)\nPitágoras chegou à conclusão de que as combinações tidas na época\ncomo "consonantes" e correspondente ao que hoje designamos por oitava,\nquinta, quarta e uníssono estão, respectivamente, nas proporções:\n\n2:1, 3:2, 4:3, 1:1"\n\nFILHO, Floriano Menezes. A acústica Musical em palavras e sons.`;
            
            case "acordes":
                return `"Acorde é uma combinação de sons simultâneos ou sucessivos quando arpejados.\nExemplo de acorde com quatro sons, separados por intervalos de terças superpostas.(...)\n\nC E G B"\n\nChediak, Almir. Dicionário de Acordes Cifrados.`;        
        
            default:
                break;
        }
    }

    render() {
        return (
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="card d-flex p-4">

                    {this.state.maquina ?
    <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable
            droppableId="usuario"
            direction="horizontal"
        >
            {(provided, snapshot) => (<>
                <div
                    className="container-cartas  mb-2"
                    ref={provided.innerRef}
                    style={getListStyle(
                        snapshot.isDraggingOver,  !this.state.turno
                    )}
                    {...provided.droppableProps}
                >
                    {this.state.maquina.map((carta, index) => (
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
                                </div>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
                {!this.state.turno ?
                    <h2 className="text-center">
                        {this.state.adversario}
                    </h2>
                : "" }
            </>)}
        </Droppable>
    </DragDropContext>
: ""}


{this.state.jogador ?
    <DragDropContext onDragEnd={this.onDragEnd}>
        <div className="cartas-armazenadas">
        <Droppable
            droppableId="baralho"
            direction="horizontal"
        >
            {(provided, snapshot) => (
                <div
                    className="container-cartas costas"
                    ref={provided.innerRef}
                    style={getListStyle(
                        snapshot.isDraggingOver
                    )}
                    {...provided.droppableProps}
                >
                    {this.state.baralho.map((carta, index) => (
                        index <= 1 ?
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
                                    <div className="borda">
                                        &#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;&#128617;
                                    </div>
                                </div>
                            )}
                        </Draggable>
                        : ""
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
        
        <div className="m-auto text-center">
        {this.state.status ?
            <div>
                <h2>
                    {this.state.status}
                </h2>
                <button onClick={this.comecar} className="btn btn-primary">Recomeçar</button>
            </div>
        : ""}
        {this.state.mensagem ?
            <div className="p-2 text-center" style={{whiteSpace: "break-spaces"}}>
                <b>{this.state.mensagem}</b>
            </div>
        : ""}
        </div>

        <Droppable
            droppableId="lixo"
            direction="horizontal"
        >
            {(provided, snapshot) => (
                <div
                    className="container-cartas"
                    ref={provided.innerRef}
                    style={getListStyle(
                        snapshot.isDraggingOver
                    )}
                    {...provided.droppableProps}
                >
                    {this.state.lixo.length ? 
                    this.state.lixo.map((carta, index) => (
                        index <= 1 ?
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
                                </div>
                            )}
                        </Draggable>
                        : ""
                    )) : <div className="m-auto">Descarte aqui</div>}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
        </div>

        <Droppable
            droppableId="usuario"
            direction="horizontal"
        >
            {(provided, snapshot) => (<>
                { this.state.turno ?
                    <h2 className="text-center">Você</h2>
                : ""}
                <div
                    className="container-jogador"
                    ref={provided.innerRef}
                    style={getListStyle(
                        snapshot.isDraggingOver,  this.state.turno
                    )}
                    {...provided.droppableProps}
                >
                    {this.state.jogador.map((carta, index) => (
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
                                </div>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
            </>
            )}
        </Droppable>



    </DragDropContext>
: ""}
                        <div className="nivelamento-container alert text-center mt-2">
                            {this.state.concluido ?
                                <div className="container-insignia">
                                    <i
                                        className={`insignia ${this.classeInsignia()}`}
                                        title={this.citacao(this.classeInsignia())}
                                    ></i>
                                    <span>
                                        {getUser("cartas", "insignia")}
                                    </span>
                                </div>
                                : <div className="text-left">
                                    <span>Progresso: {this.state.porcentagem}</span>
                                    <hr className="barra-progresso m-0" style={{ width: this.state.porcentagem }} />
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
 
    export default Cartas;