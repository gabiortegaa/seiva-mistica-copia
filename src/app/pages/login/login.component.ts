import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  cpf = '';
  senha = '';
  erro = '';
  enviando = false;

  mascararCpf(evento: Event): void {
    const alvo = evento.target as HTMLInputElement;
    const n = alvo.value.replace(/\D/g, '').slice(0, 11);
    this.cpf = n
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  entrar(): void {
    this.erro = '';

    if (!this.cpf.trim() || !this.senha.trim()) {
      this.erro = 'Preencha CPF e senha.';
      return;
    }

    this.enviando = true;

    this.auth.login(this.cpf, this.senha).subscribe({
      next: (usuario) => {
        this.enviando = false;
        if (!usuario) {
          this.erro = 'CPF ou senha incorretos.';
          return;
        }
        this.router.navigate(['/home']);
      },
      error: () => {
        this.enviando = false;
        this.erro = 'CPF ou senha incorretos.';
      }
    });
  }
}
