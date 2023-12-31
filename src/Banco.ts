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

    private consultarContaPorIndice(numero: string): number {
        let qtdContas = this._contas.length;

        for (let i = 0; i < qtdContas; i++) {
            if (this._contas[i].numero == numero) {
                return i;
            }
        }

        throw new ContaInexistenteError("A conta não existe.");
    }

    consultarConta(numero: string): Conta {
        let contaProcurada: Conta;

        const indice = this.consultarContaPorIndice(numero);
        contaProcurada = this._contas[indice];

        return contaProcurada;
    }

    incluirConta(conta: Conta) {
        try {
            this.consultarConta(conta.numero);
            throw new ContaJaExisteError("Já existe uma conta com este CPF.");
        } catch (e: any) {
            if (e instanceof ContaJaExisteError) {
                throw new ContaJaExisteError(
                    "Já existe uma conta com este CPF."
                );
            } else {
                this._contas.push(conta);
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
        const conta: Conta = this.consultarConta(numero);

        if (conta instanceof ContaImposto) {
            conta.sacar(valor);
        }

        conta.sacar(valor);
    }

    depositar(numero: string, valor: number) {
        const conta = this.consultarConta(numero);

        if (conta instanceof ContaImposto) {
            conta.depositar(valor);
        }

        conta.depositar(valor);
    }

    // questão 5
    transferir(numCred: string, numDeb: string, valor: number): void {
        const contaDeb = this.consultarConta(numCred);
        const contaCred = this.consultarConta(numDeb);
        contaDeb.transferir(contaCred, valor);
    }

    renderJuros(numero: string) {
        const conta = this.consultarConta(numero);

        if (conta instanceof Poupanca) {
            conta.renderJuros();
        } else {
            throw new PoupancaInvalidaError("Esta conta não é uma poupança.");
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

    private obterTipoConta(conta: Conta): string {
        if (conta instanceof Poupanca) {
            return "P";
        } else if (conta instanceof ContaImposto) {
            return "CI";
        } else {
            return "C";
        }
    }

    arquivoToString(conta: Conta) {
        let tipo = this.obterTipoConta(conta);
        let contaString = `${tipo};${conta.numero};${conta.nome};${conta.saldo}`;

        if (conta instanceof Poupanca) {
            contaString += `;${conta.taxaJuros}`;
        } else if (conta instanceof ContaImposto) {
            contaString += `;${conta.taxaDesconto}`;
        }

        return contaString;
    }

    consultarHistorico(numero: string): string[] {
        let indice = this.consultarContaPorIndice(numero);

        return this._contas[indice].historico;
    }
}

export { Conta, ContaImposto, Poupanca, Banco };

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
