import { AplicacaoError } from "./AplicacaoError.js";
export class SaldoInsuficienteError extends AplicacaoError {
    constructor(mensagem) {
        super(mensagem);
    }
}
