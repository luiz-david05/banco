import { AplicacaoError } from "./AplicacaoError.js";

export class ContaJaExisteError extends AplicacaoError {  
    constructor(mensagem: string) {
        super(mensagem)
    }
}