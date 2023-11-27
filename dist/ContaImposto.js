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
        const valorDesconto = valor * (1 + this._taxaDesconto / 100);
        super.sacar(valorDesconto);
    }
    depositar(valor) {
        const valorDeposito = valor * (1 - this._taxaDesconto / 100);
        super.depositar(valorDeposito);
    }
}
