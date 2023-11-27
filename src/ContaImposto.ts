import { Conta } from "./Conta.js"

export class ContaImposto extends Conta {
    constructor(nome: string, numero: string, saldo: number, private _taxaDesconto: number) {
        super(nome, numero, saldo)
    }

    get taxaDesconto() {
        return this._taxaDesconto
    }

    sacar(valor: number): void {
        const valorDesconto = valor * (1 + this._taxaDesconto / 100)
        super.sacar(valorDesconto);
    }

    depositar(valor: number) {
        const valorDeposito = valor * (1 - this._taxaDesconto / 100)
        super.depositar(valorDeposito)
    }
}