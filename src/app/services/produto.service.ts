import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Produto } from '../produto.model';
import { Categoria } from '../categoria.model';

const API = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private http = inject(HttpClient);

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${API}/produtos`);
  }

  buscarPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${API}/produtos/${id}`);
  }

  porCategoria(nome: string): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${API}/produtos`).pipe(
      map(lista => lista.filter(p => p.categoria === nome))
    );
  }

  listarCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${API}/categorias`);
  }

  criar(dados: Partial<Produto>): Observable<Produto> {
    return this.http.post<Produto>(`${API}/produtos`, dados);
  }

  atualizar(id: number, dados: Partial<Produto>): Observable<Produto> {
    return this.http.put<Produto>(`${API}/produtos/${id}`, dados);
  }

  excluir(id: number): Observable<any> {
    return this.http.delete(`${API}/produtos/${id}`);
  }
}
