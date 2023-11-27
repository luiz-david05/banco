import { Conta } from "./Conta.js";

export class Poupanca extends Conta {
    constructor(
        nome: string,
        numero: string,
        saldo: number,
        private _taxaJuros: number
    ) {
        super(nome, numero, saldo);
    }

    get taxaJuros(): number {
        return this._taxaJuros;
    }

    renderJuros() {
        this.depositar(this.saldo * this._taxaJuros/100)
    }
}