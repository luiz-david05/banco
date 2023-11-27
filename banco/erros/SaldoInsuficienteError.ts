import { AplicacaoError } from "./AplicacaoError.js";

export class SaldoInsuficienteError extends AplicacaoError {
    constructor(mensagem: string) {
        super(mensagem)
    }
}