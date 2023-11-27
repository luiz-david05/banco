import { AplicacaoError } from "./AplicacaoError.js";
export class ContaInexistenteError extends AplicacaoError {
    constructor(mensagem) {
        super(mensagem);
    }
}
