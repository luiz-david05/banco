import { Conta } from "./Conta.js";
import { Poupanca } from "./Poupanca.js";
import { ContaImposto } from "./ContaImposto.js";
import { ContaInexistenteError } from "./erros/ContaInexistenteError.js";
import { ContaJaExisteError } from "./erros/ContaJaExisteError.js";
import { PoupancaInvalidaError } from "./erros/PoupancaInvalidaError.js";

class Banco {
    private _contas: Conta[] = [];

    get contas() {
        return this._contas;
    }

    get total(): number {
        let totalDepositado = 0;
        this._contas.forEach((conta) => (totalDepositado += conta.saldo));

        return totalDepositado;
    }

    get totalContas(): number {
        return this._contas.length;
    }

    get mediaDepositada(): number {
        return this.total / this.totalContas;
    }

    private consultarContaPorIndice(numero: string): number {

        let qtdContas = this._contas.length;

        for (let i = 0; i < qtdContas; i++) {
            if (this._contas[i].numero == numero) {
                return i;
            }
        }

        throw new ContaInexistenteError("A conta não existe.")
    }

    consultarConta(numero: string): Conta {
        let contaProcurada: Conta

        const indice = this.consultarContaPorIndice(numero)
        contaProcurada = this._contas[indice]

        return contaProcurada
    }

    incluirConta(conta: Conta) {
        try {
            this.consultarConta(conta.numero)
            throw new ContaJaExisteError("Já existe uma conta com este CPF.")
            
        } catch (e: any) {
            if (e instanceof ContaJaExisteError) {
                throw new ContaJaExisteError('Já existe uma conta com este CPF.')
            } else {
                this._contas.push(conta)
            }
        }
    }

    // alterar(conta: Conta) {
    //     let indice = this.consultarContaPorIndice(conta.numero);
    //     this._contas[indice] = conta;
    // }

    excluirConta(numero: string) {
        let indice = this.consultarContaPorIndice(numero);
        this._contas.splice(indice, 1);
    }

    sacar(numero: string, valor: number) {
        let conta: Conta = this.consultarConta(numero);

        if (conta instanceof ContaImposto) {
            conta.sacar(valor)
        }

        conta.sacar(valor);
    }

    depositar(numero: string, valor: number) {
        const conta = this.consultarConta(numero)

        if (conta instanceof ContaImposto) {
            conta.depositar(valor)
        }

        conta.depositar(valor)
    }

    // questão 5
    transferir(numCred: string, numDeb: string, valor: number): void {
        const contaDeb = this.consultarConta(numCred)
        const contaCred = this.consultarConta(numDeb)
        contaDeb.transferir(contaCred, valor)
    }

    renderJuros(numero: string) {
        const conta = this.consultarConta(numero)

        if (conta instanceof Poupanca) {
            conta.renderJuros()
        } else {
            throw new PoupancaInvalidaError("Esta conta não é uma poupança.")
        }

    }

    toString(conta: Conta): string {
        let message = `\nCPF: ${conta.numero}\nNome: ${
            conta.nome
        }\nSaldo: R$ ${conta.saldo.toFixed(2)}`;
        if (conta instanceof Poupanca) {
            message += `\nTaxa de Juros: ${conta.taxaJuros}%`;
        } else if (conta instanceof ContaImposto) {
            message += `\nTaxa de imposto: ${conta.taxaDesconto}%`;
        }

        return message;
    }

    arquivoToString(conta: Conta) {
        let tipo = "C";
        if (conta instanceof Poupanca) {
            tipo = "P";
        } else if (conta instanceof ContaImposto) {
            tipo = "CI";
        }

        let contaString = `${tipo};${conta.numero};${conta.nome};${conta.saldo}`;
        if (tipo == "P") {
            contaString += `;${(conta as Poupanca).taxaJuros}`;
        } else if (tipo == "CI") {
            contaString += `;${(conta as ContaImposto).taxaDesconto}`;
        }

        return contaString;
    }

    exibirContasExistentes() {
        for (let conta of this._contas) {
            console.log(this.toString(conta));
        }
    }

    consultarHistorico(numero: string): string[] {
        let indice = this.consultarContaPorIndice(numero);

        return this._contas[indice].historico;
    }
}

export {Conta, ContaImposto, Poupanca, Banco}

// questão 5
// let banco = new Banco();
// let conta = new Conta("teste", "1111", 100);
// let conta2 = new Conta("teste2", "2222", 100);

// banco.incluirConta(conta);
// banco.incluirConta(conta2);

// banco.transferir("1111", "2222", 200);
// aumentou a robustez do app, sem a necessidade de tantos if para a validação


// questão 8
// let banco = new Banco();
// let conta = new Conta("teste", "1111", 100);
// let conta2 = new Conta("teste2", "2222", 100);

// banco.incluirConta(conta);
// banco.incluirConta(conta2);

// console.log(banco.consultarConta('1111'))
// banco.consultarConta('12')