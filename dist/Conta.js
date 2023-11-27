import { InputInvalidoError } from "./erros/InputInvalidoError.js";
import { SaldoInsuficienteError } from "./erros/SaldoInsuficienteError.js";
import { ValorInvalidoError } from "./erros/ValorInvalidoError.js";
export class Conta {
    _nome;
    _numero;
    _saldo;
    _historico;
    constructor(_nome, _numero, _saldo, _historico = []) {
        this._nome = _nome;
        this._numero = _numero;
        this._saldo = _saldo;
        this._historico = _historico;
        // this.validaValor(this._saldo)
        this._historico = [`Conta criada: +${_saldo}`];
    }
    get nome() {
        return this._nome;
    }
    get numero() {
        return this._numero;
    }
    get saldo() {
        return this._saldo;
    }
    get historico() {
        return this._historico;
    }
    // questão 3
    sacar(valor) {
        this.validaSaldo(this._saldo, valor);
        this._saldo -= valor;
        this._historico.push(`Saque: -${valor}`);
    }
    depositar(valor) {
        this.validaValor(valor);
        this._saldo += valor;
        this._historico.push(`Depósito: +${valor}`);
    }
    transferir(contaDestino, valor) {
        this.sacar(valor);
        contaDestino.depositar(valor);
        // this._historico.push(
        //     `Transferência: +${valor} para conta ${contaDestino._numero}`
        // );
    }
    validaInput(input) {
        if (isNaN(input)) {
            throw new InputInvalidoError("O valor deve ser um número.");
        }
    }
    validaValor(valor) {
        this.validaInput(valor);
        if (valor <= 0) {
            throw new ValorInvalidoError("O valor deve ser positivo.");
        }
    }
    validaSaldo(saldo, valor) {
        this.validaInput(saldo);
        this.validaInput(valor);
        if (saldo < 0 || valor > saldo) {
            throw new SaldoInsuficienteError("O saldo não foi suficiente para finalizar a operação.");
        }
    }
}
/* questão 4
let conta = new Conta('teste', '111', 100)
let conta2 = new Conta('teste2', '222', 100)
conta.transferir(conta2, 200)

/a exceção do método sacar é propagada para o transferir */ 
