export default class EscalaDiatonica {
    constructor() {
        this.notas = [
            {
                cifra: "A",
                nome: "Lá"
            },
            {
                cifra: "B",
                nome: "Si"
            },
            {
                cifra: "C",
                nome: "Dó"
            },
            {
                cifra: "D",
                nome: "Ré"
            },
            {
                cifra: "E",
                nome: "Mi"
            },
            {
                cifra: "F",
                nome: "Fá"
            },
            {
                cifra: "G",
                nome: "Sol"
            }
        ];
    }

    reordenarEscalaDiatonica(indice) {
        const escalaReordenada = [];
        this.notas = this.mudarFundamental(
            indice,
            escalaReordenada,
            this.notas
        );
    }

    geraNumeroAleatorio() {
        return parseInt(1 + Math.random() * (7 - 1));
    }

    // Indice % base = indice na base
    mudarFundamental(indiceFundamental, escalaNova, notas) {
        for (var i = indiceFundamental; i < indiceFundamental + 7; i++) {
            i > 6 ? escalaNova.push(notas[i % 7]) : escalaNova.push(notas[i]);
        }

        return escalaNova;
    }
}
