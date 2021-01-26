import Notas from "./Notas";
import Ordens from "./Ordens";

export default class Escalas {
    constructor() {
        this.diatonica = new Notas();
        this.ordem = new Ordens();
    }

    geraNumeroAleatorio(array) {
        const random = parseInt(0 + Math.random() * (array.length - 0));
        return random;
    }

    aumentaUmaOitava(escala) {
        escala.forEach(nota => {
            escala.push(nota);
        });
    }

    reduzPraUmaOitava(escala) {
        escala.forEach( (nota, index) => {
            if(index <= 7) {
                escala.splice(escala.length - 1);
            }
        });
    }

    // Verifica se a nota está na escala diatonica
    verificaNota(input) {
        let nota = this.diatonica.notas.filter((nota)=>{
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

    // Escolhe uma ordem (bemol ou sustenido)
    geraEscalaAleatoria() {
        let escolhe = this.geraNumeroAleatorio(["b", "#"]);
        let tonalidade = escolhe ? this.ordem.bemois : this.ordem.sustenidos;
        let escala = this.maior( tonalidade[this.geraNumeroAleatorio(tonalidade)].cifra );

        return escala;
    }

    // Ordena a escala de acordo com sua fundamental
    ordena(fundamental) {
        try {
            let indice = this.diatonica.notas.findIndex(e => {
                return e.cifra == fundamental[0];
            });
    
            let ordenado = this.ordem.mudar(indice, new Notas().notas);
    
            ordenado.map( (nota, i) =>{nota.id = i.toString()})
    
            return ordenado;
        } catch (error) {
            return false;
        }
    }

    // Adiciona sustenidos ou bemois para formar escalas maiores
    adicionarAcidentes(escala, input) {
        var
        tonalidades,
        acidente = { simbolo: '', nome: '' },
        posicao = { sensivel: 0, fundamental: 0 };
        let tom = { cifra: input }
        try {
            this.aumentaUmaOitava(escala)

            if(this.ordem.verificaOrdem(tom.cifra, this.ordem.sustenidos, 2)) {
                tonalidades = this.ordem.geraOrdem("sustenidos");
                acidente = {
                    simbolo: "#",
                    nome: "sustenido"
                };
                posicao = {
                    sensivel: 0,
                    fundamental: 1
                };
            } else if (this.ordem.verificaOrdem(tom.cifra, this.ordem.bemois, 6)) {
                tonalidades = this.ordem.geraOrdem("bemois");
                acidente = {
                    simbolo: "b",
                    nome: "bemol"
                };
                posicao = {
                    sensivel: 1,
                    fundamental: 4
                };
            }

            let sensivel = false;
            let fundamental = false;
    
            tonalidades.map( (tonalidade, i) => {
                // Pega o indice dessa tonalidade na escala quando
                // a cifra da escala for a mesma que a da tonalidade
                let index = escala.findIndex(n => {
                    return n.cifra == tonalidade.cifra;
                });
    
                if (!(fundamental && sensivel)) {
                    // Na escala
                    this.ordem.alteraNota(escala[index], acidente.simbolo, acidente.nome);
                    // Na ordem
                    this.ordem.alteraNota(tonalidade, acidente.simbolo, acidente.nome);
                }
    
                sensivel = this.ordem.comparaNotas(
                    tonalidades[(i + posicao.sensivel) % 7],
                    escala[escala.length - 1],
                    sensivel
                );
                fundamental = this.ordem.comparaNotas(
                    escala[index + posicao.fundamental],
                    tom,
                    fundamental
                );
                return tonalidade;
            });
            
            return escala;
        } catch (error) {
            // Se não está nas ordens, mas for a escala de C então retorna uma escala
            if(escala && escala[0].cifra == "C") {
                return escala;
            } else {
                return false;
            }
        }
    }

    maior(input) {
        input = this.verificaNota(input);
        let ordena = this.ordena(input);
        let escala = this.adicionarAcidentes(ordena, input);

        escala ? this.reduzPraUmaOitava(escala) : ''

        return escala;
    }
}
