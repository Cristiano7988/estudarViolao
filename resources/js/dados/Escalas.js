import Notas from "./Notas";
import Ordens from "./Ordens";

export default class Escalas {
    constructor(nivel) {
        this.nivel = nivel;
        this.diatonica = new Notas();
        this.ordem = new Ordens();
        this.nova = this.geraEscalaAleatoria();
    }

    geraNumeroAleatorio(escala) {
        const random = parseInt(1 + Math.random() * (escala.length - 1));
        return random;
    }

    aumentaUmaOitava(escala) {
        escala.forEach(nota => {
            escala.push(nota);
        });
    }

    // Verifica a ordem utilizada e adiciona os acidentes
    maior(tom, escala) {
        if (this.ordem.usariaSustenidos(tom.cifra)) {
            this.ordem.usarSustenidos(tom, escala);
        }

        return escala;
    }

    // Ordena a escala de acordo com sua fundamental
    ordena(fundamental) {
        let indice = this.diatonica.notas.findIndex(e => {
            return e.cifra == fundamental;
        });

        return this.ordem.mudar(indice, new Notas().notas);
    }

    // Interpreta o modo (Maior ou Menor) de acordo com o tom
    modula(tom) {
        let escala = this.ordena(tom.cifra[0]);

        this.aumentaUmaOitava(escala);

        if (!tom.cifra.match(/m/)) {
            return this.maior(tom, escala);
        }
    }

    // Escolhe uma ordem (bemol ou sustenido)
    // Escolhe um modo (Maior ou menor)
    // Escolhe um sistema (Tonal ou modal)
    geraEscalaAleatoria() {
        let nova_escala = this.modula(
            this.ordem.sustenidos[
                this.geraNumeroAleatorio(this.ordem.sustenidos)
            ]
        );

        let random = this.geraNumeroAleatorio(nova_escala);

        let reordena = this.ordem.mudar(random, nova_escala);

        return reordena;
    }
}
