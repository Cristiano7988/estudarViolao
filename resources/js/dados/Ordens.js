import Notas from "./Notas";

export default class Ordens {
    constructor() {
        // variavéis pra consulta apenas, para alterar use a função geraOrdem
        this.sustenidos = this.geraOrdem("sustenidos");
        this.bemois = this.geraOrdem("bemois");
    }

    geraOrdem(ordem) {
        if(ordem =='sustenidos') {
            return this.acidente('#', 'sustenido', this.ordemDosSustenitos())};
        if(ordem =='bemois') {
            return this.acidente('b', 'bemol', this.ordemDosBemois())};
    }

    comparaNotas(nota1, nota2, resultado) {
        resultado = nota1.cifra == nota2.cifra.replace("m", "") ? true : resultado;

        return resultado;
    }

    alteraNota(nota, simbolo, nome) {
        nota.cifra += simbolo;
        nota.nome = !!nota.nome.match(new RegExp(nome))
            ? nota.nome.replace(" ", " dobrado ")
            : nota.nome + " " + nome;
    }

    verificaOrdem(tom, tonalidades, i) {
        let especifica = [];
        tonalidades.map(nota=> {
            especifica.push(nota);
        })

        especifica.splice(0, i);

        let ordem = especifica.includes(
            especifica.find(o => {
                return o.cifra == tom.replace("m", '');
            })
        );
        return ordem;
    }

    mudar(indiceFundamental, notas) {
        let escalaNova = [];
        notas.map((nota, index) => {
            escalaNova.push(notas[(index + indiceFundamental) % notas.length]);
        });

        return escalaNova;
    }

    ordemDosSustenitos() {
        let ordem = [];
        let escala = this.mudar(5, new Notas().notas);
        escala.forEach((nota, i) => {
            ordem.push(escala[(4 * i) % 7]);
        });

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

    acidente(simbolo, nome, tonalidades) {
        tonalidades.map(nota => {
            tonalidades.push({
                cifra: nota.cifra + simbolo,
                nome: nota.nome + " " + nome
            });
        });

        return tonalidades;
    }
}
