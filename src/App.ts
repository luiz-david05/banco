import { Conta, Banco, Poupanca, ContaImposto } from "./Banco.js";
import { input } from "./utils.js";
import { AplicacaoError } from "./erros/AplicacaoError.js";
import { ArquivoError } from "./erros/ArquivoError.js";
import { InputInvalidoError } from "./erros/InputInvalidoError.js";
import { CPFInvalidoError } from "./erros/CPFInvalidoError.js";
import * as fs from 'fs'

class App {
    private _banco = new Banco();

    static main() {
        let app = new App();
        app.run();
    }

    private carregarContas(): void {
        try {
        const contasArquivo: string[] = fs
            .readFileSync("contas.txt")
            .toString()
            .split("\n");

        contasArquivo.forEach((conta) => {
            const dadosConta = conta.split(";");

            const [tipo, numero, nome, saldo, taxa]: string[] = dadosConta;

            let novaConta: Conta

            if (tipo == 'C') {
                novaConta = new Conta(nome, numero, Number(saldo))
            } else if (tipo == 'P') {
                novaConta = new Poupanca(nome, numero, Number(saldo), Number(taxa))
            } else {
                novaConta = new ContaImposto(nome, numero, Number(saldo), Number(taxa))
            }

            this._banco.incluirConta(novaConta);
        });
        } catch {
            throw new ArquivoError("Erro ao carregar o arquivo!")
        }
    }
    
    private salvarContas(): void {
        try {
            const contas = this._banco.contas;
            
            const contasParaEscrever = contas.map((conta) => {
                return this._banco.arquivoToString(conta);
            });
            
            fs.writeFileSync("./contas.txt", "");
            
            fs.appendFileSync("./contas.txt", contasParaEscrever.join("\n"));
        } catch {
            throw new ArquivoError("Erro ao salvar o arquivo!")
        }
    }

    private validaCPF(cpf: string): void {
        cpf = cpf.replace(/[^\d]+/g, "");

        if (cpf.length !== 11 || /^(.)\1+$/.test(cpf)) {
            throw new CPFInvalidoError(
                "CPF inválido: formato incorreto ou todos os dígitos iguais."
            );
        }

        let add = 0;
        for (let i = 0; i < 9; i++) {
            add += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let digito1 = 11 - (add % 11);
        digito1 = digito1 >= 10 ? 0 : digito1;
        if (digito1 !== parseInt(cpf.charAt(9))) {
            throw new CPFInvalidoError(
                "CPF inválido: primeiro dígito verificador incorreto."
            );
        }

        add = 0;
        for (let i = 0; i < 10; i++) {
            add += parseInt(cpf.charAt(i)) * (11 - i);
        }
        let digito2 = 11 - (add % 11);
        digito2 = digito2 >= 10 ? 0 : digito2;
        if (digito2 !== parseInt(cpf.charAt(10))) {
            throw new CPFInvalidoError(
                "CPF inválido: segundo dígito verificador incorreto."
            );
        }
    }

    private validaNome(nome: string) {
        if (nome.length < 5 || nome.length > 100) {
            throw new InputInvalidoError(
                "Nome inválido: o comprimento deve estar entre 5 e 100 caracteres"
            );
        }

        if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(nome)) {
            throw new InputInvalidoError(
                "Nome inválido: caracteres não permitidos encontrados."
            );
        }
    }

    private validaValor(valor: number) {
        if (isNaN(valor) || valor <= 0) {
            throw new InputInvalidoError(
                "Valor inválido: o valor deve ser maior que zero."
            );
        }
    
    }

    private validaOpcao() {
        let opcao = input("Tecle a opção correspondente: ").trim();
    
        while (opcao === "" || isNaN(Number(opcao)) || Number(opcao) < 0 || Number(opcao) > 8) {
            console.log("Opção inválida!");
    
            opcao = input("Tecle a opção correspondente: ").trim();
        }
    
        return opcao;
    }
    

    criarConta(): void {
        const nome = input("Nome do titular: ");
        this.validaNome(nome);
        const cpf = input("Insira o CPF: ");
        this.validaCPF(cpf);
        const saldo = Number(
            input(
                "Insira o valor que deseja depositar para iniciar sua conta: "
            )
        );
        this.validaValor(saldo);

        console.log(
            "Selecione o tipo de conta: [C] - Corrente, [P] - Poupança, [CI] - Imposto"
        );

        const tipo = input("Digite aqui: ");

        let conta: Conta;

        if (tipo == "C") {
            conta = new Conta(nome, cpf, saldo);
        } else if (tipo == "P") {
            conta = new Poupanca(nome, cpf, saldo, 0.5);
        } else if (tipo == "CI") {
            conta = new ContaImposto(nome, cpf, saldo, 0.25);
        } else {
            throw new InputInvalidoError("Tipo da conta inválido!");
        }

        this._banco.incluirConta(conta);

        console.log("Conta cadastrada com sucesso!")
        // console.log(this._banco.toString(conta))
    }

    consultarConta(): void {
        const cpf = input("Insira o CPF do titular: ");

        const conta = this._banco.consultarConta(cpf);

        console.log(this._banco.toString(conta));
    }

    sacar(): void {
        const cpf = input("Insira o CPF do titular: ");

        const valor = Number(input("Insira o valor a ser sacado: "));

        this._banco.sacar(cpf, valor)

        console.log("Saque realizado com sucesso!");
    }

    depositar(): void {
        const cpf = input("Insira o CPF do titular: ");

        const valor = Number(input("Insira o valor a ser depositado: "));

        this._banco.depositar(cpf, valor)

        console.log("Depósito realizado com sucesso!");
    }

    transferir(): void {
        const cpf = input("Insira o CPF do titular: ");

        const valor = Number(input("Insira o valor a ser transferido: "));

        const cpfDestino = input("Insira o CPF do destinatário: ");

        this._banco.transferir(cpf, cpfDestino, valor)

        console.log("Transferência realizada com sucesso!");
    }

    renderJuros(): void {
        const cpf = input("Insira o CPF do titular: ");

        this._banco.renderJuros(cpf)

        console.log("Juros renderizados com sucesso!");
    }

    excluirConta(): void {
        const cpf = input("Insira o CPF do titular: ")
        this._banco.excluirConta(cpf)

        console.log('\nConta excluida com sucesso!')
    }

    exibirHistorico(): void {
        const cpf = input("Insira o CPF do titular: ")

        console.log(`Histórico de operações: ${this._banco.consultarHistorico(cpf)}`)
    }

    menu(): void {
        console.log("\nOpções disponíveis:");

        const texto =
            '\n\t1 - Criar Conta no Banco\n' +
            '\n\t2 - Consultar conta a partir do CPF do titular\n' +
            '\n\t3 - Realizar saque na conta\n' +
            '\n\t4 - Realizar depósito na conta\n' +
            '\n\t5 - Realizar transferencia entre contas\n' +
            '\n\t6 - Render juros Conta Poupanca\n' +
            '\n\t7 - Consultar histórico de operações\n' +
            '\n\t8 - Excluir conta\n' +
            '\n\t0 - sair\n'

        console.log(texto);
    }

    run(): void {
        console.log("Carregando dados da aplicação...");

        try {
            this.carregarContas();
            console.log('\nDados carregados!')
        } catch(e: any) {
            console.log(e.message)
        }

        let opcao: number;
        do {
            input("\nTecle enter para continuar...");
            this.menu();
            opcao = Number(this.validaOpcao());
            try {
                switch (opcao) {
                    case 0:
                        this.salvarContas();
                        break;
                    case 1:
                        this.criarConta();
                        break;
                    case 2:
                        this.consultarConta();
                        break
                    case 3:
                        this.sacar();
                        break;
                    case 4:
                        this.depositar();
                        break;
                    case 5:
                        this.transferir();
                        break;
                    case 6:
                        this.renderJuros()
                        break
                    case 7:
                        this.exibirHistorico()
                        break
                    case 8:
                        this.excluirConta()
                        break
                }
            } catch (e: any) {
                console.log(
                    `\nNão foi possível concluir a operação!\n${e.message}`
                );
                if (!(e instanceof AplicacaoError)) {
                    console.log(
                        "Ops, este erro não foi reconhecido..., contate o administrador."
                    );
                }
            }
        } while (opcao != 0);

        console.log("\nAplicação encerrada.");
    }
}

App.main();