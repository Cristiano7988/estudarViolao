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

    escolhe(array) {
        const random = parseInt(0 + Math.random() * (array.length - 0));
        return array[random];
    }

    aumentaUmaOitava(escala) {
        const novaOitava = copiarObj(escala);

        escala.push(...novaOitava);
        escala.forEach((nota, indice)=>nota.idOitava = indice.toString());

        return escala;
    }

    reduzPraUmaOitava(escala) {
        return escala.splice(7);
    }

    // Escolhe uma ordem (bemol ou sustenido)
    geraEscalaAleatoria() {
        let tonalidade = this.escolhe([this.ordem.bemois, this.ordem.sustenidos]);
        let tom = this.escolhe(tonalidade).cifra + this.escolhe(["", "m"]);
        let complemento =
            tom.match(/m/)
                ? this.escolhe(["natural", "harmonica", "melodica"])
                : "";
        let escala = this.formarEscala(tom, true, complemento);

        return escala;
    }

    // Define o limite das tonalidades utilizadas no modo
    // Ex.: F, C, [G, D, A, E, B];
    limitarEscala(s, b) {
        let limite = {
            sustenidos: s,
            bemois: b
        }
        return limite;
    }

    // Define a posição de um acidente da tonalidade em relação a uma escala
    // Ex. Sensivel: F, C, [G] => A, B, C#, D, E, F#, [G#], A 
    // Ex. Fundamental: F, C, [G] => F#, [G#], A, B, C, D, E, F#
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
    adicionarAcidentes(escala, input, complemento) {
        try {

            const menor = input.match(/m/);
            const sobrenome = menor
                ? " menor " + complemento
                : " maior ";
            const tom = {
                cifra: input,
                nome: escala[0].nome + sobrenome
            };
            escala.push(...escala); // Aumenta uma oitava sem mexer nos idOitavas
            
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
                tom,
                modo: menor ? "menor" : "maior",
                complemento: menor ? complemento : ""
            }

            if(tom.cifra == "C" || tom.cifra == "Am") {
                switch (complemento) {
                    case "harmonica":
                    case "Harmônica":
                        this.acidente.alteraNota(escala[escala.length-1], this.acidente.sustenido)
                        break;
                    case "melodica":
                    case "Melódica":
                        this.acidente.alteraNota(escala[escala.length-1], this.acidente.sustenido)
                        this.acidente.alteraNota(escala[escala.length-2], this.acidente.sustenido)
                        break;
                
                    default:
                        break;
                }

                return dados;
            }

            tonalidades.map( (tonalidade, i) => {
                // Pega o indice dessa tonalidade na escala quando
                // a cifra da escala for a mesma que a da tonalidade
                let index = escala.findIndex(n => n.cifra == tonalidade.cifra );
    
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

            switch (complemento) {
                case "harmonica":
                case "Harmônica":
                    escala[escala.length-1].cifra.match(/[b]/g)
                        ? this.acidente.bequadro(escala[escala.length-1], this.acidente.bemol) 
                        : this.acidente.alteraNota(escala[escala.length-1], this.acidente.sustenido)
                    break;
                case "melodica":
                case "Melódica":
                    escala[escala.length-1].cifra.match(/[b]/g)
                        ? this.acidente.bequadro(escala[escala.length-1], this.acidente.bemol) 
                        : this.acidente.alteraNota(escala[escala.length-1], this.acidente.sustenido)
                    escala[escala.length-2].cifra.match(/[b]/g)
                        ? this.acidente.bequadro(escala[escala.length-2], this.acidente.bemol) 
                        : this.acidente.alteraNota(escala[escala.length-2], this.acidente.sustenido)
                    break;
            
                default:
                    break;
            }
            
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
            filtra = input.replace(/^[A-G]/,"").match(/[b#]/),
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

    formarEscala(input, diatonica, complemento) {
        this.diatonica.verificaNota(input); 
        let ordena = this.ordem.ordena(input);
        let escala;

        if(diatonica) {
            escala = this.adicionarAcidentes(ordena, input, complemento);
            this.reduzPraUmaOitava(escala.notas);
        } else {
            escala = this.cromatica(input, ordena)
        }
        
        return escala;
    }

    pegaHomonimos(original) {
        let escala = this.formarEscala(original, false);
        let anterior, proxima;

        let antecede = escala.notas[(/[FC]/.test(original) ? 11 : 10) % escala.notas.length].cifra.replace(/[b#]/, "");
        let prescede = escala.notas[2 % escala.notas.length].cifra;
        prescede = prescede.replace(/#|b/g, "")
        
        if(!/#/.test(original)) {
        anterior = !/[FC]/.test(original) && !/b/.test(original)
            ? antecede += "##"
            : antecede += "#";
        } else {
            anterior = !/[FC]/.test(original)
                ? /##/.test(original) ? antecede + "####" : antecede + "###"
                : antecede + "##"
        }
        
        if(!/##/.test(original)) {
            proxima = /#/.test(original) || /[EB]/.test(original)
                ? /b/.test(original) ? prescede += "bb" : prescede += "b"
                : /b/.test(original) ? prescede += "bbb" : prescede += "bb";
        } else {
            proxima = prescede
        }

        if(/b/.test(original)) {
            anterior = /[E|B]/.test(antecede) || /bb/.test(original) ? anterior.replace("#", "") : anterior;
            proxima = /bb/.test(original) && /[E|B]/.test(original)  ? proxima + 'b' : proxima
        }
        
            
        return `[${original}] [${anterior}] [${proxima}]`
    }
}
