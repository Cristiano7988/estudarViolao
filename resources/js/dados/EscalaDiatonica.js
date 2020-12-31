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
        this.escalaAleatoria = this.notas;
        this.escalaManipulavel = this.notas.map((nota)=> {return nota});
    }

    geraNumeroAleatorio() {
        return parseInt(1 + Math.random() * (7 - 1));
    }

    // Indice % base = indice na base
    mudarFundamental(indiceFundamental, notas) {
        let escalaNova = [];
        for (var i = indiceFundamental; i < indiceFundamental + 7; i++) {
            i > 6 ? escalaNova.push(notas[i % 7]) : escalaNova.push(notas[i]);
        }

        return escalaNova;
    }

    ordemDosSustenitos() {
        let ordem = [];
        let escala = this.mudarFundamental(5, this.notas);
        escala.forEach((nota, i)=> {
            ordem.push(escala[(4 * i) % 7])
        })

        return ordem;
    }

    aumentaUmaOitava(escala) {
        escala.forEach(nota=>{ escala.push(nota); })
    }

    modulaEscalaMaior(fundamental) {
        let indice = this.notas.findIndex( (e)=>{ return e.cifra == fundamental.cifra[0] });
        
        let encontrouSensivel, encontrouFundamental;
            
        let escala = this.mudarFundamental(indice, this.notas);
        let ordem = this.ordemDosSustenitos();
    
        this.aumentaUmaOitava(escala);
        this.aumentaUmaOitava(ordem);        
        
        ordem.map( (nota ) => {
            if( !(encontrouFundamental && encontrouSensivel) ) {
                escala[ escala.indexOf(nota) ].cifra += '#';
                escala[ escala.indexOf(nota) ].nome =
                    !!nota.nome.match(/sustenido/)
                        ? nota.nome.replace(' ',' dobrado ')
                        : escala[ escala.indexOf(nota) ].nome + ' sustenido';
            }
            if( nota.cifra == escala[escala.length - 1].cifra ) { encontrouSensivel = true; }
            if(escala[ escala.indexOf(nota) + 1 ].cifra === fundamental.cifra) { encontrouFundamental = true; }
        })
        return escala
    }
}
