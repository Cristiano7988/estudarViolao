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
        if(simbolo == "#") {
            return this.sustenido;
        } else if (simbolo == "b") {
            return this.bemol
        }
        
        return false;
    }

    alteraNota(nota, acidente) {
        nota.cifra += acidente.simbolo;
        nota.nome = !!nota.nome.match(new RegExp(acidente.nome))
            ? nota.nome.replace(" ", " dobrado ")
            : nota.nome + " " + acidente.nome;
        return nota;
    }

    bequadro(nota, acidente) {
        nota.cifra = nota.cifra.replace(new RegExp(acidente.simbolo), "");
        nota.nome = !!nota.nome.match(new RegExp(acidente.nome))
            ? nota.nome.replace(new RegExp(acidente.nome), "")
            : nota.nome;
        return nota;
    }
}