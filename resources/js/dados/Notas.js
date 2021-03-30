const arrayCifras = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const arrayNomes = ['Lá', 'Si', 'Dó', 'Ré', 'Mi', 'Fá', 'Sol'];

export default class Notas {
    constructor() {
        const notasObj =
            arrayCifras.map( (cifra, indice)=>{
                return {
                    cifra,
                    nome: arrayNomes[indice]
                }
            });

        this.notas = notasObj;   
    }

    // Verifica se a nota está na escala diatonica
    verificaNota(input) {
        let nota = this.notas.filter( nota => nota.cifra == input[0] );
        if(!nota.length) return false;

        return input;
    }
}