import { InputInvalidoError } from "./erros/InputInvalidoError.js";
import { SaldoInsuficienteError } from "./erros/SaldoInsuficienteError.js";
import { ValorInvalidoError } from "./erros/ValorInvalidoError.js";

export class Conta {
    constructor(
        private _nome: string,
        private _numero: string,
        private _saldo: number,
        private _historico: string[] = []
    ) {
        // this.validaValor(this._saldo)
        this._historico = [`Conta criada: +${_saldo}`];
    }

    get nome(): string {
        return this._nome;
    }
    
    get numero(): string {
        return this._numero;
    }

    get saldo(): number {
        return this._saldo;
    }

    get historico(): string[] {
        return this._historico;
    }

    // questão 3
    sacar(valor: number): void {
        this.validaSaldo(this._saldo, valor)

        this._saldo -= valor;
        this._historico.push(`Saque: -${valor}`);
    }

    depositar(valor: number): void {
        this.validaValor(valor)

        this._saldo += valor;
        this._historico.push(`Depósito: +${valor}`);
    }


    transferir(contaDestino: Conta, valor: number): void {
        this.sacar(valor);
        contaDestino.depositar(valor);
        // this._historico.push(
        //     `Transferência: +${valor} para conta ${contaDestino._numero}`
        // );
    }

    private validaInput(input: number): void {
        if (isNaN(input)) {
            throw new InputInvalidoError("O valor deve ser um número.")
        }
    }

    private validaValor(valor: number): void {
        this.validaInput(valor)
        if (valor <= 0) {
            throw new ValorInvalidoError("O valor deve ser positivo.")
        }
    }

    private validaSaldo(saldo: number, valor: number) {
        this.validaInput(saldo)
        this.validaInput(valor)

        if (saldo < 0 || valor > saldo) {
            throw new SaldoInsuficienteError("O saldo não foi suficiente para finalizar a operação.")
        }
    }
}

/* questão 4
let conta = new Conta('teste', '111', 100)
let conta2 = new Conta('teste2', '222', 100)
conta.transferir(conta2, 200)

/a exceção do método sacar é propagada para o transferir */