import { AplicacaoError } from "./AplicacaoError.js";
export class CPFInvalidoError extends AplicacaoError {
    constructor(mensagem) {
        super(mensagem);
    }
}
