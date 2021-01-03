import Notas from "./Notas";

export default class Ordens {
    constructor() {
        this.sustenidos = this.sustenidos();
    }

    comparaNotas(nota1, nota2, resultado) {
        resultado = nota1.cifra == nota2.cifra ? true : resultado;

        return resultado;
    }

    adicionaSustenido(nota) {
        nota.cifra += "#";
        nota.nome = !!nota.nome.match(/sustenido/)
            ? nota.nome.replace(" ", " dobrado ")
            : nota.nome + " sustenido";
    }

    usarSustenidos(tom, escala) {
        let sensivel = false;
        let fundamental = false;

        this.sustenidos.every(nota => {
            let index = escala.findIndex(n => {
                return n.cifra[0] == nota.cifra[0];
            });

            if (!(fundamental && sensivel)) {
                this.adicionaSustenido(escala[index]);
                this.adicionaSustenido(nota);
            }

            sensivel = this.comparaNotas(
                nota,
                escala[escala.length - 1],
                sensivel
            );
            fundamental = this.comparaNotas(
                escala[index + 1],
                tom,
                fundamental
            );

            return nota;
        });
    }

    usariaSustenidos(tom) {
        return ![0, 1].includes(
            this.sustenidos.findIndex(o => {
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

    sustenidos() {
        let tonalidades = this.ordemDosSustenitos();

        tonalidades.map(nota => {
            tonalidades.push({
                cifra: nota.cifra + "#",
                nome: nota.nome + " sustenido"
            });
        });

        return tonalidades;
    }
}
