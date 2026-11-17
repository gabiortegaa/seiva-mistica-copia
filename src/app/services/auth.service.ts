import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, switchMap, tap, throwError } from 'rxjs';
import { Usuario } from '../usuario.model';

const API = 'http://localhost:3000';
const CHAVE = 'seiva-usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private subject = new BehaviorSubject<Usuario | null>(this.lerSessao());
  usuario$ = this.subject.asObservable();

  get atual(): Usuario | null {
    return this.subject.value;
  }

  login(cpf: string, senha: string): Observable<Usuario | null> {
    const digitos = (cpf || '').replace(/\D/g, '');

    return this.http.get<Usuario[]>(`${API}/usuarios`).pipe(
      map(lista => {
        const achado = lista.find(
          u => (u.cpf || '').replace(/\D/g, '') === digitos && u.senha === senha
        );

        if (!achado) {
          return null;
        }

        this.salvarSessao(achado);
        return achado;
      })
    );
  }

  cadastrar(usuario: Usuario): Observable<Usuario> {
    const cpfDigitos = (usuario.cpf || '').replace(/\D/g, '');
    const email = (usuario.email || '').toLowerCase();

    return this.http.get<Usuario[]>(`${API}/usuarios`).pipe(
      switchMap(lista => {
        const cpfRepetido = lista.some(
          u => (u.cpf || '').replace(/\D/g, '') === cpfDigitos
        );
        const emailRepetido = lista.some(
          u => (u.email || '').toLowerCase() === email
        );

        if (cpfRepetido || emailRepetido) {
          return throwError(
            () => ({ status: 409, message: 'CPF ou e-mail já cadastrado' }) as any
          );
        }

        return this.http.post<Usuario>(`${API}/usuarios`, usuario);
      }),
      tap(novo => this.salvarSessao(novo))
    );
  }

  sair(): void {
    this.subject.next(null);
    try {
      localStorage.removeItem(CHAVE);
    } catch {}
  }

  private salvarSessao(usuario: Usuario): void {
    this.subject.next(usuario);
    try {
      localStorage.setItem(CHAVE, JSON.stringify(usuario));
    } catch {}
  }

  private lerSessao(): Usuario | null {
    try {
      const bruto = localStorage.getItem(CHAVE);
      if (!bruto) {
        return null;
      }
      const dados = JSON.parse(bruto);
      return dados && typeof dados === 'object' ? dados : null;
    } catch {
      return null;
    }
  }
}
