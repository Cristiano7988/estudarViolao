import Escalas from "./Escalas";

export default class Intervalos {
    constructor() {
        this.escala = new Escalas();
        this.encontraAcorde = this.encontraAcorde.bind();
    }

    atribuiValores(distancia) {
        let casos = [];
        let indices = [];
        let nome;

        switch (distancia.diatonica) {
            case 2:
                nome = "segunda"
                casos = [0, 0.5, 1, 1.5];
                indices = [0, 1, 2, 3];
                break;
            case 3:
                nome = "terça"
                casos = [1, 1.5, 2, 2.5];
                indices = [2, 3, 4, 5];
                break;
            case 4:
                nome = "quarta"
                casos = [2, 2.5, 3];
                indices = [4, 5, 4];
                break;
            case 5:
                nome = "quinta"
                casos = [3, 3.5, 4];
                indices = [4, 5, 4];
                break;
            case 6:
                nome = "sexta"
                casos = [3.5, 4, 4.5, 5];
                indices = [5, 4, 5, 4];
                break;
            case 7:
                nome = "setima"
                casos = [4.5, 5, 5.5, 6];
                indices = [5, 4, 5, 4];
                break;
            case 0:
                nome = "oitava"
                casos = [5.5, 0, 6.5];
                indices = [5, 4, 5];
                break;
        }

        let tom = "Tom";
        let tons = "Tons";
        let semitom = String.fromCharCode(189);

        let valores = [
            /* 0 */ `unissono`,           
            /* 1 */ `${semitom}  ${tom}`, 
            /* 2 */ tom,                  
            /* 3 */ `${tom} e ${semitom}`,
            /* 4 */ `${nome == "oitava" ? 6 : distancia.diatonica - 1} ${tons}`,
            /* 5 */ `${distancia.diatonica - 1}  ${tons}  e ${semitom}`,
        ];

        let intervalo = {};
        switch (distancia.semitons) {
            case casos[0]:
                intervalo.nome = "diminuta";
                intervalo.valor = valores[indices[0]];
                break;
            
            case casos[1]:
                if(nome == "quarta" || nome == "quinta" || nome == "oitava") {
                    intervalo.nome = "justa"
                } else {
                    intervalo.nome = "menor"
                }
                intervalo.valor = valores[indices[1]];
                break;
            
            case casos[2]:
                if(nome == "quarta" || nome == "quinta" || nome == "oitava") {
                    intervalo.nome = "aumentada"
                } else {
                    intervalo.nome = "maior"
                }
                intervalo.valor = valores[indices[2]];
                break;

            case casos[3]:
                if(nome == "quarta" || nome == "quinta" || nome == "oitava") {
                    intervalo.nome = false
                } else {
                    intervalo.nome = "aumentada"
                }
                intervalo.valor = valores[indices[3]]
                break;
        }

        intervalo.prefixo = nome
        intervalo.categoria = distancia.diatonica
        
        return intervalo;
    }

    distanciaDiatonica(atual, proxima) {
        var intervalo;
        for( let i = atual; (i % 7) != proxima; i++) {
            intervalo = i - atual + 2;
        }
        return intervalo == undefined ? 0 : intervalo;
    }

    classifica(notas) {
        var cromatica = this.escala.formarEscala(notas[0].cifra, 0);

        let indices = notas.map(nota => {
            let homonimos = this.escala.pegaHomonimos(nota.cifra);
            return cromatica.notas.findIndex( n => new RegExp(`\\[${n.cifra}\\]`).test(homonimos) );
        })

        let ids = notas.map(nota=> { return parseInt(nota.id) })

        let intervalo = this.distanciaDiatonica(ids[0], ids[1]);

        let distancia = {
            diatonica: intervalo,
            cromatica: indices[1] - indices[0]
        };

        distancia.semitons = distancia.cromatica * 0.5;

        return this.atribuiValores(distancia);
    }

    verificaTriade(modo, quinta) {
        var validos = ["33","66","43","34","65","56"];
        
        return validos.includes(`${modo.valor}${quinta.valor}`);
    }

    encontraAcorde(notas) {
        var acordes = [];

        notas.forEach( (nota, indice) => {
            let proxima = (indice + 1 ) % notas.length;
            let ultima = (indice + 2) % notas.length;

            let resultado = this.verificaTriade(
                this.classifica([ nota, notas[proxima] ]),
                this.classifica([ notas[proxima], notas[ultima] ])
            );

            if(resultado && !acordes.includes(nota) && !acordes.includes(notas[ultima])) {
                acordes.push( nota, notas[proxima], notas[ultima] )
            }
        })

        return acordes.length ? acordes : false;
    }
}