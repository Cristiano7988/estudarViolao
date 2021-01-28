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
        let escolhe_ordem = this.geraNumeroAleatorio(["b", "#"]);
        let tonalidade = escolhe_ordem ? this.ordem.bemois : this.ordem.sustenidos;

        let tom = tonalidade[this.geraNumeroAleatorio(tonalidade)].cifra;
        
        let escolhe_modo = this.geraNumeroAleatorio(["M", "m"]);
        escolhe_modo ? tom += "m" : ''
        let escala = this.formarEscala( tom );

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
        try {
            var
            tonalidades,
            acidente = { simbolo: '', nome: '' },
            posicao = { sensivel: 0, fundamental: 0 };
            var menor = input.match(/m/) ? 1 : 0;
            var tom = { cifra: input }
            let limite = {}
    
            this.aumentaUmaOitava(escala)
            
            if(menor) {
                limite = {
                    sustenidos: 5,
                    bemois: 3
                }
            } else {
                limite = {
                    sustenidos: 2,
                    bemois: 6
                }
            }
            if(this.ordem.verificaOrdem(tom.cifra, this.ordem.sustenidos, limite.sustenidos)) {
                tonalidades = this.ordem.geraOrdem("sustenidos");
                acidente = {
                    simbolo: "#",
                    nome: "sustenido"
                };
                posicao = {
                    sensivel: 0,
                    fundamental: menor ? 6 : 1
                };
            } else if (this.ordem.verificaOrdem(tom.cifra, this.ordem.bemois, limite.bemois)) {
                tonalidades = this.ordem.geraOrdem("bemois");
                acidente = {
                    simbolo: "b",
                    nome: "bemol"
                };
                posicao = {
                    sensivel: 1,
                    fundamental: menor ? 2 : 4
                };
            }

            let sensivel = menor ? true : false;
            let fundamental = false;

            var dados = {
                notas: escala,
                tom: tom,
                modo: menor ? "Menor Natural" : "Maior"
            }

            if(tom.cifra == "C" || tom.cifra == "Am") {
                return dados;
            }

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

                if(!menor) {
                    sensivel = this.ordem.comparaNotas(
                        tonalidades[(i + posicao.sensivel) % 7],
                        escala[escala.length - 1],
                        sensivel
                    );
                }
                fundamental = this.ordem.comparaNotas(
                    escala[index + posicao.fundamental],
                    tom,
                    fundamental
                );
                return tonalidade;
            });

            dados.escala = escala;
            
            return dados;
        } catch (error) {
            return false;
        }
    }

    formarEscala(input) {
        input = this.verificaNota(input);
        let ordena = this.ordena(input);
        let escala = this.adicionarAcidentes(ordena, input);

        escala.notas ? this.reduzPraUmaOitava(escala.notas) : ''

        return escala;
    }
}
