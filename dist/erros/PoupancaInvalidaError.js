import { AplicacaoError } from "./AplicacaoError.js";
export class PoupancaInvalidaError extends AplicacaoError {
    constructor(mensagem) {
        super(mensagem);
    }
}
