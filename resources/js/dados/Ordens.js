import Notas from "./Notas";

export default class Ordens {
    constructor() {
        this.sustenidos = this.acidente('#', 'sustenido', this.ordemDosSustenitos());
        this.bemois = this.acidente('b', 'bemol', this.ordemDosBemois());
    }

    comparaNotas(nota1, nota2, resultado) {
        resultado = nota1.cifra == nota2.cifra ? true : resultado;

        return resultado;
    }

    adicionaAcidente(nota, simbolo, nome) {
        nota.cifra += simbolo;
        nota.nome = !!nota.nome.match(new RegExp(nome))
            ? nota.nome.replace(" ", " dobrado ")
            : nota.nome + " " + nome;
    }

    usar(tom, escala, notas, acidente, nome_acidente, posicao_sensivel, posicao_fundamental) {
        let sensivel = false;
        let fundamental = false;

        notas.map( (nota, i) => {
            let index = escala.findIndex(n => {
                return n.cifra[0] == nota.cifra[0];
            });

            if (!(fundamental && sensivel)) {
                this.adicionaAcidente(escala[index], acidente, nome_acidente);
                this.adicionaAcidente(nota, acidente, nome_acidente);
            }

            sensivel = this.comparaNotas(
                notas[(i + posicao_sensivel) % 7],
                escala[escala.length - 1],
                sensivel
            );
            fundamental = this.comparaNotas(
                escala[index + posicao_fundamental],
                tom,
                fundamental
            );

            return nota;
        });
    }

    verificaOrdem(tom, tonalidades, i) {
        let especifica = [];
        tonalidades.map(nota=> {
            especifica.push(nota);
        })

        especifica.splice(0, i);
        
        return especifica.includes(
            tonalidades.find(o => {
                return o.cifra == tom;
            })
        );
    }

    mudar(indiceFundamental, notas) {
        let escalaNova = [];
        notas.map((nota, index) => {
            escalaNova.push(notas[(index + indiceFundamental) % notas.length]);
        });

        return escalaNova;
    }

    ordemDosSustenitos() {
        let ordem = [];
        let escala = this.mudar(5, new Notas().notas);
        escala.forEach((nota, i) => {
            ordem.push(escala[(4 * i) % 7]);
        });

        return ordem;
    }

    ordemDosBemois() {
        let ordem = [];
        let tonalidades = this.ordemDosSustenitos();
        tonalidades.map(nota => {
            ordem.unshift(nota);
        });

        return ordem;
    }

    acidente(simbolo, nome, tonalidades) {
        tonalidades.map(nota => {
            tonalidades.push({
                cifra: nota.cifra + simbolo,
                nome: nota.nome + " " + nome
            });
        });

        return tonalidades;
    }
}