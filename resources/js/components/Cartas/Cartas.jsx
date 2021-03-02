import React, { Component } from 'react';
import { DragDropContext } from "react-beautiful-dnd";
import Escalas from '../../dados/Escalas';
import Intervalos from '../../dados/Intervalos';
import Draganddrop from '../Draganddrop/Draganddrop';
import Tools from '../../tools.js';

class Cartas extends Component {
    constructor() {
        super();
        this.escala = new Escalas();
        this.intervalo = new Intervalos();
        this.tools = new Tools();
        this.onDragEnd = this.onDragEnd.bind(this);
        this.classifica = this.classifica.bind(this);
        this.comecar = this.comecar.bind(this);
        this.state = {},
        this.naipes = {
            ouros: String.fromCharCode(9830),
            paus: String.fromCharCode(9827),
            copas: String.fromCharCode(9829),
            espadas: String.fromCharCode(9824)
        }
    }

    componentDidMount() {
        this.comecar();
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
                    concluido: parseInt(this.tools.getUser("cartas", "concluido"))
                })
            }
            if(this.state.porcentagem == "100%" && !this.state.concluido) {
                fetch(`/conclui/${this.tools.getUser("cartas", "id")}`)
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
        let acertos = this.tools.getUser('cartas', 'acertos');
        let erros = this.tools.getUser('cartas', 'erros');

        this.setState({
            acertos,
            erros,
            concluido: parseInt(this.tools.getUser('cartas', 'concluido')),
            porcentagem: this.tools.porcentagem(parseInt(acertos), parseInt(erros)),
            status: false,
            turno: true,
            adversario: adversarios[random],
            lixo: [],
            largou: false,
            comprou: false
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
        let maquina=[];

        excluir = excluir.length > 0 ? excluir[0] : excluir;

        var fora = lista.map( item => {
            if(item.key != excluir.key) {
                maquina.push(item);
            } else {
                return item;
            }
        })

        fora = fora.filter(Boolean)

        // Junta o que tem q colocar fora com o que tá fora
        let lixo = this.state.lixo
        lixo.unshift(fora[0])

        setTimeout(
            ()=>
                this.setState({
                    maquina,
                    lixo,
                    largou: false,
                    comprou: false,
                    turno: true
                }),
            1000
        )

        return fora ? true : false;
    }

    registraResultado(status, mensagens) {
        let random = parseInt(0 + Math.random() * (mensagens.length - 0))

        this.setState({
            status,
            mensagem: mensagens[random],
            turno: false,
            adversario: false,
            porcentagem: this.tools.porcentagem(this.state.acertos, this.state.erros)
        })

        if(status == "Empatou") return;

        let token = document.querySelector("input[name=_token]").value;
        let formData = new FormData();

        formData.append("id", this.tools.getUser("cartas", "user_id"));
        formData.append("resultado", status == "Você Ganhou" ? 1 : 0);
        formData.append("_token", token);
        formData.append("exercicio", "cartas");

        fetch("/salvar-resultado", {
            method: "post",
            body: formData
        }).then((r)=> {
            return r.json();
        }).then(r=>{})
    }

    classifica(notas) {
        var cromatica = this.escala.formarEscala(notas[0].cifra, 0);

        let indices = notas.map(nota => {
            let homonimos = this.escala.pegaHomonimos(nota.cifra);
            return cromatica.notas.findIndex( n => new RegExp(`\\[${n.cifra}\\]`).test(homonimos) );
        })

        let ids = notas.map(nota=> { return parseInt(nota.id) })

        let intervalo = this.intervalo.distanciaDiatonica(ids[0], ids[1]);

        let distancia = {
            diatonica: intervalo,
            cromatica: indices[1] - indices[0]
        };

        distancia.semitons = distancia.cromatica * 0.5;

        return this.intervalo.atribuiValores(distancia);
    }

    procuraIntervalo(array, valores) {
        let notas = array.map( (nota, indice) => {
            let proxima = array[(indice + 1) % array.length];
            let intervalo = this.classifica([nota, proxima])

            if(valores.includes(intervalo.categoria)) {
                return nota
            } else {
                return false
            }
        })

        notas = notas.filter(Boolean)

        return notas.length ? notas : false
    }

    // Verifica se a jogada possui um acorde
    encontraAcorde(jogadas) {
        var acordes = [];
        
        jogadas.forEach( jogada => {
            jogada.forEach( (nota, indice) => {
                let proxima = (indice + 1 ) % jogada.length;
                let ultima = (indice + 2) % jogada.length;
    
                let resultado = this.verificaTriade(
                    this.classifica([ nota, jogada[proxima] ]),
                    this.classifica([ jogada[proxima], jogada[ultima] ])
                );
    
                if(resultado && !acordes.includes(nota) && !acordes.includes(jogada[ultima])) {
                    acordes.push( nota, jogada[proxima], jogada[ultima] )
                }
            })
        })
    
        return acordes;
    }

    descarta(jogadas) {
        var descartar = false;

        var acordes = this.encontraAcorde(jogadas);

        // Separa os acordes das outras cartas
        let descartaveis = this.state.maquina.map(carta=> {
            if(!acordes.includes(carta)) {
                return carta
            } else {
                return false
            }
        })

        descartaveis = descartaveis.filter(Boolean)

        if(acordes.length == 6) {
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
        descartar = this.procuraIntervalo(descartaveis, [0])

        // Exclui a carta da jogada que tiver 1 carta
        if(!descartar) {
            descartaveis.every(descartavel=> {
                if(descartavel.length != 1) {
                    return;
                } else {
                    descartar = descartavel[0];
                }
            })
        }

        // Exclui a carta que estiver em um intervalo de segunda ou sétima
        if(!descartar) {
            descartar = this.procuraIntervalo(descartaveis, [2, 7])
        }
        
        // Exclui uma carta qualquer, pra evitar de ficar com 7 cartas
        if(!descartar) {
            descartar = descartaveis[0]
        }

        this.separa(this.state.maquina, descartar)
    }

    agrupaNaipes(cartas) {
        var jogadas = Object.keys(this.naipes).map(naipe => {
            return cartas.filter(nota=> nota.naipe.nome == naipe)
        });

        return jogadas;
    }

    separaNaipes(cartas) {
        // Agrupa as notas por naipes  
        var jogadas = this.agrupaNaipes(cartas)

        // Ordena as cartas do jogador pelo nome dos naipes
        var maquina = cartas.sort( (proxima, nota) => {
            return nota.naipe.nome.localeCompare(proxima.naipe.nome)
        })

        setTimeout(
            ()=> this.setState({maquina}, this.descarta(jogadas)),
            1000
        )
    }

    // Pega uma carta do baralho
    pegaCarta(maquina) {
        let baralho = this.state.baralho.reverse();
        let removida = baralho.pop();
        maquina.push(removida);
        baralho.reverse();

        setTimeout(
            ()=>
                this.setState({
                    baralho,
                    maquina,
                    turno: false
                }, this.separaNaipes(maquina)),
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
        var validos = ["33","66","43","34","65","56"];
        
        return validos.includes(`${modo.categoria}${quinta.categoria}`);
    }

    verificaResposta(notas) {
        
        if(notas.length != 6) {
            return;
        }
        let novas = this.agrupaNaipes(notas)
        let acordes = this.encontraAcorde(novas);

        if(acordes.length == 6) {
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

    salvaJogada(tipo, result) {
        
        this.setState({
            jogador: result.usuario,
            lixo: result.lixo,
            comprou: !tipo ? true : this.state.comprou,
            largou: tipo ? true : this.state.largou
        }, ()=> {
            if(this.state.largou && this.state.comprou) {
                this.setState({turno: false})
            }
            this.verificaResposta(result.usuario, tipo)
        });
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
        if(!this.state.turno) {
            this.setState({mensagem: "Espere a sua vez"})
            return;
        }

        var mensagem = false;

        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            const jogador = this.tools.reorder(
                this.getList(source.droppableId),
                source.index,
                destination.index
            );

            if (source.droppableId === 'usuario') {
                this.setState({jogador}, this.verificaResposta(jogador));
            }

        } else {

            const result = this.tools.move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );

            if(this.state.jogador.length >= 7 && destination.droppableId != "lixo") {
                mensagem = "Você precisa largar uma carta";
            }

            if(this.state.largou && source.droppableId == "lixo") {
                mensagem = "Não é possível recuperar esta carta";
            }

            if(destination.droppableId == "baralho") {
                mensagem = 'Deste baralho você só pode retirar cartas';
            }

            if( (source.droppableId == "baralho" || source.droppableId == "lixo") && this.state.comprou ) {
                mensagem = "Você já pegou uma carta";
            }

            if(source.droppableId == "baralho" && destination.droppableId == "lixo") {
                mensagem = 'Seu jogo são as cartas abaixo';
            }

            this.setState({mensagem})
            if(mensagem) return;

            if(source.droppableId == "baralho" && destination.droppableId == "usuario") {
                this.setState({
                    jogador: result.usuario,
                    baralho: result.baralho,
                    comprou: true
                }, ()=>this.state.comprou && this.state.largou ? this.setState({turno: false}) : "");
            }
            
            if(source.droppableId == "lixo") {
                this.salvaJogada(0, result)
            }
            if(destination.droppableId == "lixo") {
                this.salvaJogada(1, result)
            }
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
            let notas = this.tools.copiarObj(tonalidade).notas;
            notas.map(nota=> {
                nota.naipe = {
                    nome: nome,
                    simbolo: Object.entries(this.naipes)[index][1]
                }
            })
            baralho.push(...notas)
        })

        baralho = this.embaralha(baralho);

        baralho.map( (carta, index) => carta.key = index.toString() )

        let jogador = baralho.slice(0, 6);
        baralho = baralho.slice(jogador.length, baralho.length)

        let maquina = baralho.slice(0, 6);
        baralho = baralho.slice(maquina.length, baralho.length)

        this.setState({
            mensagem: null,
            tonalidade: tonalidade.notas,
            baralho,
            jogador,
            maquina
        })
    }

    render() {
        return (
            <div className="container py-4">
                <div className="modal-espera">
                    <div className="card d-flex p-4 mt-4 text-center">
                        <p>Use este recurso em uma tela maior</p>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="card d-flex p-4">

                    {this.state.maquina ? (
                        <DragDropContext onDragEnd={this.onDragEnd}>
                            <Draganddrop
                                nome="maquina"
                                cartas={this.state.maquina}
                                turno={this.state.turno}
                            />
                        {!this.state.turno ?
                            <h2 className="text-center">
                                {this.state.adversario}
                            </h2>
                        : "" }
                        </DragDropContext>
                    ) : ""}

                    {this.state.jogador ?
                        <DragDropContext onDragEnd={this.onDragEnd}>
                            <div className="cartas-armazenadas">
                                <Draganddrop
                                    nome="baralho"
                                    cartas={this.state.baralho}
                                    costas={true}
                                    limite={1}
                                />
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
                                <Draganddrop
                                    nome="lixo"
                                    cartas={this.state.lixo}
                                    limite={1}
                                />
                            </div>
                            {this.state.turno ?
                                <h2 className="text-center">Você</h2>
                            : ""}
                            <Draganddrop
                                nome="usuario"
                                cartas={this.state.jogador}
                                turno={this.state.turno}
                            />
                        </DragDropContext>
                    : ""}
                        <div className="nivelamento-container alert text-center mt-2">
                            {this.state.concluido ?
                                <div className="container-insignia">
                                    <i
                                        className={`insignia ${this.tools.classeInsignia(this.tools.getUser("cartas", "insignia"))}`}
                                        title={this.tools.citacao(this.tools.classeInsignia(this.tools.getUser("cartas", "insignia")))}
                                    ></i>
                                    <span>
                                        {this.tools.getUser("cartas", "insignia")}
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