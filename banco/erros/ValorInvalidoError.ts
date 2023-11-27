import { AplicacaoError } from "./AplicacaoError.js";

export class ValorInvalidoError extends AplicacaoError {
    constructor(mensagem: string) {
        super(mensagem)
    }
}