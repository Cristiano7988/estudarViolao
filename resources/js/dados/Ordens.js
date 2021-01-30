import Acidentes from "./Acidentes";
import Notas from "./Notas";

const copiarObj = (obj) => JSON.parse(JSON.stringify(obj));

export default class Ordens {
    constructor() {
        this.diatonica = new Notas();
        this.acidente = new Acidentes();
        this.sustenidos =
            this.completaOrdem(
                this.acidente.sustenido,
                this.ordemDosSustenitos()
            );
        this.bemois =
            this.completaOrdem(
                this.acidente.bemol,
                this.ordemDosBemois()
            );
    }

    // Ordena a escala de acordo com sua fundamental
    ordena(fundamental) {
        try {
            let indice = this.diatonica.notas.findIndex(e => {
                return e.cifra == fundamental[0];
            });
            let expressao = `(index + ${indice}) % escala.length`
    
            let ordenado = this.alteraIndice(new Notas().notas, expressao);
    
            ordenado.map( (nota, i) =>{nota.id = i.toString()})
    
            return ordenado;
        } catch (error) {
            return false;
        }
    }

    // Verifica qual ordem o tom deve utilizar
    verificaOrdem(tom, tonalidades, i) {
        tonalidades = copiarObj(tonalidades);
        tonalidades.splice(0, i);

        let ordem = tonalidades.includes(
            tonalidades.find(o => {
                return o.cifra == tom.replace("m", '');
            })
        );
        return ordem;
    }

    alteraIndice(escala, expressao) {
        let nova_escala = [];
        escala.map((nota, index) => {
            nova_escala.push(escala[eval(expressao)]);
        });

        return nova_escala;
    }

    ordemDosSustenitos() {
        let escala = this.alteraIndice(this.diatonica.notas, `(index + 5) % escala.length`);
        let ordem = this.alteraIndice(escala, `(4 * index) % escala.length`);

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

    completaOrdem(acidente, tonalidades) {
        tonalidades.map(nota => {
            tonalidades.push(
                this.acidente.alteraNota(copiarObj(nota), acidente)
            );
        });

        return tonalidades;
    }
}
