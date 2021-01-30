export default class Acidentes {
    constructor() {
        this.sustenido = {
                nome: "sustenido",
                simbolo: "#"
            };
        this.bemol = {
            nome: "bemol",
            simbolo: "b"
        }
    }

    escolhe(simbolo) {
        let acidente = simbolo == "#"
            ? this.sustenido
            : this.bemol;

        return acidente;
    }

    alteraNota(nota, acidente) {
        nota.cifra += acidente.simbolo;
        nota.nome = !!nota.nome.match(new RegExp(acidente.nome))
            ? nota.nome.replace(" ", " dobrado ")
            : nota.nome + " " + acidente.nome;
        return nota;
    }
}