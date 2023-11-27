import { Conta } from "./Conta.js";
export class Poupanca extends Conta {
    _taxaJuros;
    constructor(nome, numero, saldo, _taxaJuros) {
        super(nome, numero, saldo);
        this._taxaJuros = _taxaJuros;
    }
    get taxaJuros() {
        return this._taxaJuros;
    }
    renderJuros() {
        this.depositar(this.saldo * this._taxaJuros / 100);
    }
}
