export default class Tools {
    constructor() {
        this.getUser = this.getUser.bind();
        this.copiarObj = this.copiarObj.bind();
        this.porcentagem = this.porcentagem.bind();
        // this.getItemStyle = this.getItemStyle();
        // this.getListStyle = this.getListStyle();
        this.reorder = this.reorder.bind();
        this.move = this.move.bind();
        this.classeInsignia = this.classeInsignia.bind();
        this.citacao = this.citacao.bind();
    }

    getUser(exercicio, item) {
        let resultados = JSON.parse(document.querySelector("[data-usuario]").dataset.usuario);
    
        let resultados_exercicio = resultados.find(resultado=> {return resultado.exercicio === exercicio})
        return resultados_exercicio[item];
    };

    copiarObj(obj) {
        return JSON.parse(JSON.stringify(obj))
    };

    porcentagem(acertos, erros) {
        let total = (acertos - erros) * 10;

        total = total <= 0 ? "0%" : total + "%";

        return total;
    }

    // getItemStyle(isDragging, draggableStyle) {
    //     // change background colour if dragging
    //     boxShadow: isDragging ? "10px 10px 10px black" : "1px 1px 3px black",
    
    //     // styles we need to apply on draggables
    //     ...draggableStyle
    // };
    
    // getListStyle(isDraggingOver, turno) {
    //     background: isDraggingOver ? "lightblue" : turno ? "aliceblue" : "unset"
    // };
    
    // a little function to help us with reordering the result
    reorder(list, startIndex, endIndex) {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
    
        return result;
    };
    
    /**
     * Moves an item from one list to another list.
     */
    move(source, destination, droppableSource, droppableDestination) {
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const [removed] = sourceClone.splice(droppableSource.index, 1);
    
        destClone.splice(droppableDestination.index, 0, removed);
    
        const result = {};
        result[droppableSource.droppableId] = sourceClone;
        result[droppableDestination.droppableId] = destClone;
    
        return result;
    };

    classeInsignia(nome) {
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

}