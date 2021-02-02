import Acidentes from "./Acidentes";
import Notas from "./Notas";
import Ordens from "./Ordens";

const copiarObj = (obj) => JSON.parse(JSON.stringify(obj));

export default class Escalas {
    constructor() {
        this.diatonica = new Notas();
        this.ordem = new Ordens();
        this.acidente = new Acidentes();
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

    // Escolhe uma ordem (bemol ou sustenido)
    geraEscalaAleatoria() {
        let escolhe = this.geraNumeroAleatorio(["b", "#"]);
        let tonalidade = escolhe ? this.ordem.bemois : this.ordem.sustenidos;

        let tom = tonalidade[this.geraNumeroAleatorio(tonalidade)].cifra;
        
        escolhe = this.geraNumeroAleatorio(["M", "m"]);
        escolhe ? tom += "m" : ''
        let escala = this.formarEscala( tom, 1 );

        return escala;
    }

    // Define o limite das tonalidades utilizadas no modo
    limitarEscala(s, b) {
        let limite = {
            sustenidos: s,
            bemois: b
        }
        return limite;
    }

    definePosicao(s, f) {
       let posicao = {
            sensivel: s,
            fundamental: f
        };
        return posicao;
    }

    comparaNotas(nota1, nota2, resultado) {
        resultado = nota1.cifra == nota2.cifra.replace("m", "") ? true : resultado;

        return resultado;
    }

    // Adiciona sustenidos ou bemois para formar escalas maiores
    adicionarAcidentes(escala, input) {
        try {
            var menor = input.match(/m/) ? 1 : 0;
            var tom = { cifra: input }
    
            this.aumentaUmaOitava(escala)
            
            let limite = menor
                ? this.limitarEscala(5, 3)
                : this.limitarEscala(2, 6);

            if(this.ordem.verificaOrdem(tom.cifra, this.ordem.sustenidos, limite.sustenidos)) {
                var
                acidente = this.acidente.sustenido,
                tonalidades = copiarObj(this.ordem.sustenidos),
                posicao = this.definePosicao(0, menor ? 6 : 1);
            } else if (this.ordem.verificaOrdem(tom.cifra, this.ordem.bemois, limite.bemois)) {
                var
                acidente = this.acidente.bemol,
                tonalidades = copiarObj(this.ordem.bemois),
                posicao = this.definePosicao(1, menor ? 2 : 4);
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
                    this.acidente.alteraNota(escala[index], acidente);
                    // Na ordem
                    this.acidente.alteraNota(tonalidade, acidente);
                }

                if(!menor) {
                    sensivel = this.comparaNotas(
                        tonalidades[(i + posicao.sensivel) % 7],
                        escala[escala.length - 1],
                        sensivel
                    );
                }
                fundamental = this.comparaNotas(
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

    cromatica(input, escala) {
        try {
            var
            nova_escala = [],
            filtra = input.replace(input[0],"").match(/[b,#]/),
            acidente = this.acidente.escolhe(filtra ? filtra[0] : "#");

            escala.map( (nota, i) => {
                let nova = filtra
                    ? this.acidente.alteraNota(copiarObj(nota), acidente)
                    : nota

                nova_escala.push(nova);

                if(!nota.nome.match(/i/)) {
                    nova = acidente == this.acidente.sustenido
                        ? this.acidente.alteraNota(copiarObj(nova), acidente)
                        : nota

                    nova_escala.push(nova);
                }
            })

            let cromatica = {
                notas: nova_escala,
                modo: "Cromática",
                tom: nova_escala[0]
            }
            return cromatica;
        } catch (error) {
                
        }
    }

    formarEscala(input, diatonica) {
        input = this.diatonica.verificaNota(input);
        let ordena = this.ordem.ordena(input);
        let escala;

        if(parseInt(diatonica)) {
            escala = this.adicionarAcidentes(ordena, input);
            escala.notas ? this.reduzPraUmaOitava(escala.notas) : ''
        } else {
            escala = this.cromatica(input, ordena)
        }
        
        return escala;
    }
}
