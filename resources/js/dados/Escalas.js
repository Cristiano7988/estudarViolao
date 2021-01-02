import Notas from "./Notas";

export default class Escalas {
    constructor(nivel) {
        this.nivel = nivel
        this.diatonica = new Notas();
        this.nova_escala = this.geraEscalaAleatoria();
    }

    geraNumeroAleatorio(escala) {
        const random = parseInt(1 + Math.random() * (escala.length - 1));
        return random;
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
        let escala = this.mudarFundamental(5, new Notas().notas);
        escala.forEach((nota, i)=> {
            ordem.push(escala[(4 * i) % 7])
        })

        return ordem;
    }

    aumentaUmaOitava(escala) {
        escala.forEach(nota=>{ escala.push(nota); })
    }

    modulaEscalaMaior(fundamental) {
        let indice = this.diatonica.notas.findIndex( (e)=>{ return e.cifra == fundamental.cifra[0] });
        
        let encontrouSensivel = false;
        let encontrouFundamental = false;
            
        let escala = this.mudarFundamental(indice, new Notas().notas);
        let ordem = this.ordemDosSustenitos();
    
        this.aumentaUmaOitava(escala);
        this.aumentaUmaOitava(ordem);

        if(![0,1].includes(ordem.findIndex((o)=>{ return o.cifra == fundamental.cifra}))) {
            ordem.every( (nota,i ) => {
                let index = escala.findIndex( (n)=> { return n.cifra[0] == nota.cifra[0]})
                if( !(encontrouFundamental && encontrouSensivel) ) {
                    escala[ index ].cifra += '#';
                    nota.cifra += '#'
                    escala[ index ].nome =
                        !!escala[ index ].nome.match(/sustenido/)
                            ? escala[ index ].nome.replace(' ',' dobrado ')
                            : escala[ index ].nome + ' sustenido';
                }
                if( nota.cifra == escala[escala.length - 1].cifra ) { encontrouSensivel = true; }
                if( escala[ index + 1 ].cifra === fundamental.cifra) { encontrouFundamental = true; }

                return nota;
            })
        }

        return escala
    }

    geraEscalaAleatoria() {
        let ordem = this.ordemDosSustenitos();

        // gera tonalidade
        if(this.nivel >= 2) {
            ordem.map(nota=>{ ordem.push({cifra:nota.cifra + '#', nome: nota.nome + ' sustenido'}) })
        }

        let nova_escala = this.modulaEscalaMaior( ordem[ this.geraNumeroAleatorio(ordem) ] );
        let reordena = [];
        
        let random = this.geraNumeroAleatorio(nova_escala);
        
        nova_escala.map((nota,index)=> {
            reordena.push(nova_escala[(index + random) % nova_escala.length])
        })

        return reordena;
    }
}
