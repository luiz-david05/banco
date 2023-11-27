import { Conta } from "./Conta.js";
export class ContaImposto extends Conta {
    _taxaDesconto;
    constructor(nome, numero, saldo, _taxaDesconto) {
        super(nome, numero, saldo);
        this._taxaDesconto = _taxaDesconto;
    }
    get taxaDesconto() {
        return this._taxaDesconto;
    }
    sacar(valor) {
        const valorDesconto = this.saldo * (1 + this._taxaDesconto / 100);
        super.sacar(valor + valorDesconto);
    }
}
