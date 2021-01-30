export default class Notas {
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

    // Verifica se a nota está na escala diatonica
    verificaNota(input) {
        let nota = this.notas.filter((nota)=>{
            if(nota.cifra == input[0]) {
                return input;
            }
        })
        
        if(nota.length) {
            return input;
        } else {
            return false;
        }
    }
}