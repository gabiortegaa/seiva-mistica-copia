import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../usuario.model';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  nome = '';
  cpf = '';
  email = '';
  senha = '';
  preferencias: string[] = [];

  opcoes = ['Cristais', 'Tarô e Oráculos', 'Ervas Aromáticas e Banhos'];

  erro = '';
  enviando = false;

  alternar(pref: string): void {
    const i = this.preferencias.indexOf(pref);
    if (i >= 0) {
      this.preferencias.splice(i, 1);
    } else {
      this.preferencias.push(pref);
    }
  }

  mascararCpf(evento?: Event): void {
    if (evento) {
      const alvo = evento.target as HTMLInputElement;
      this.cpf = alvo.value;
    }

    const n = this.cpf.replace(/\D/g, '').slice(0, 11);
    this.cpf = n
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  criar(): void {
    this.erro = '';

    if (!this.nome.trim()) {
      this.erro = 'Informe seu nome.';
      return;
    }

    if (!this.cpfValido(this.cpf)) {
      this.erro = 'CPF inválido.';
      return;
    }

    if (!this.email.includes('@') || !this.email.includes('.')) {
      this.erro = 'Informe um e-mail válido.';
      return;
    }

    if (this.senha.length < 4) {
      this.erro = 'A senha precisa ter ao menos 4 caracteres.';
      return;
    }

    const novo: Usuario = {
      nome: this.nome.trim(),
      cpf: this.cpf,
      email: this.email.trim().toLowerCase(),
      senha: this.senha,
      preferencias: [...this.preferencias]
    };

    this.enviando = true;

    this.auth.cadastrar(novo).subscribe({
      next: () => {
        this.enviando = false;
        this.router.navigate(['/home']);
      },
      error: () => {
        this.enviando = false;
        this.erro = 'Não foi possível criar a conta. Este CPF ou e-mail já existe?';
      }
    });
  }

  private cpfValido(cpf: string): boolean {
    const n = cpf.replace(/\D/g, '');
    if (n.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(n)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += Number(n[i]) * (10 - i);
    let d1 = (soma * 10) % 11;
    if (d1 === 10) d1 = 0;
    if (d1 !== Number(n[9])) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += Number(n[i]) * (11 - i);
    let d2 = (soma * 10) % 11;
    if (d2 === 10) d2 = 0;
    return d2 === Number(n[10]);
  }
}
