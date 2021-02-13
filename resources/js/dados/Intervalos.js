import Escalas from "./Escalas";

export default class Intervalos {
    constructor() {
        this.escala = new Escalas();
    }

    atribuiValores(distancia, nome) {
        let casos = [];
        let indices = [];
        
        switch (nome) {
            case "segunda":
                casos = [0, 0.5, 1, 1.5];
                indices = [0, 1, 2, 3];
                break;
            case "terça":
                casos = [1, 1.5, 2, 2.5];
                indices = [2, 3, 4, 5];
                break;
        }

        let tom = "Tom";
        let tons = "Tons";
        let semitom = String.fromCharCode(189);

        let valores = [
            `unissono`,
            `${semitom}  ${tom}`,
            tom,
            `${tom} e ${semitom}`,
            `${distancia.diatonica} ${tons}`,
            `${distancia.diatonica} ${tons}  e ${semitom}`,
        ];

        let intervalo = {};
        switch (distancia.semitons) {
            case casos[0]:
                intervalo.nome = "diminuta";
                intervalo.valor = valores[indices[0]];
                break;
            
            case casos[1]:
                intervalo.nome = "menor";
                intervalo.valor = valores[indices[1]];
                break;
            
            case casos[2]:
                intervalo.nome = "maior";
                intervalo.valor = valores[indices[2]];
                break;

            case casos[3]:
                intervalo.nome = "aumentada";
                intervalo.valor = valores[indices[3]]
                break;
        }
        return intervalo;
    }

    classificaIntervalo(nota1, nota2) {
        var cromatica = this.escala.formarEscala(nota1, 0);
        var cromatica2 = this.escala.formarEscala(nota2, 0);

        let homonimos1 = this.escala.pegaHomonimos(nota1);
        let homonimos2 = this.escala.pegaHomonimos(nota2);
        
        // pega a posição dos homonimos da escala diatonica na escala cromatica
        let index = cromatica.notas.findIndex( nota=> new RegExp(`\\[${nota.cifra}\\]`).test(homonimos1) );
        let index2 = cromatica.notas.findIndex( nota=> new RegExp(`\\[${nota.cifra}\\]`).test(homonimos2) );
    
        let diatonica = this.escala.diatonica.notas;

        let id = diatonica.findIndex(nota=>nota.cifra==nota1[0]);
        let id2 = diatonica.findIndex(nota=>nota.cifra == nota2[0]);

        // Calculo distancia entre as notas
        let distancia = {
            diatonica: id2 - id,
            cromatica: index2 - index
        };

        if(index2 == -1) {
            index = cromatica2.notas.findIndex( nota=> new RegExp(`\\[${nota.cifra}\\]`).test(homonimos1) );
            index2 = cromatica2.notas.findIndex( nota=> new RegExp(`\\[${nota.cifra}\\]`).test(homonimos2) );
        }
        
        // Calculo para 2 oitavas
        if(distancia.cromatica < 0) {
            distancia.cromatica = ((index2 + 12) - index) % 13;
        }
        if(distancia.diatonica < 0 ) {
            distancia.diatonica = ( (id2 + 7) - id ) % 9;
        }

        distancia.semitons = distancia.cromatica * 0.5;

        switch (distancia.diatonica) {
            case 1:
                return this.atribuiValores(distancia, "segunda");
            case 2:
                return this.atribuiValores(distancia, "terça");
            default:
                break;
        }
    }
}