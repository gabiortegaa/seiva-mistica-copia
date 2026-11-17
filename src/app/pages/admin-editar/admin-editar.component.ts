import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Produto {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  imagem: string;
  descricao: string;
  estoque: number;
}

@Component({
  selector: 'app-admin-editar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-editar.component.html',
  styleUrls: ['./admin-editar.component.css']
})
export class AdminEditarComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  produtos: Produto[] = [];
  carregando = true;
  erro = '';

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.erro = '';

    this.http.get<Produto[]>('/produtos').subscribe({
      next: lista => {
        this.produtos = lista;
        this.carregando = false;
      },
      error: () => {
        this.produtos = [];
        this.carregando = false;
        this.erro = 'Não foi possível carregar os produtos.';
      }
    });
  }

  editar(p: Produto): void {
    this.router.navigate(['/admin'], { queryParams: { editar: p.id } });
  }

  excluir(p: Produto): void {
    const confirmar = confirm(`Excluir o produto "${p.nome}"?`);
    if (!confirmar) return;

    this.http.delete(`/produtos/${p.id}`).subscribe({
      next: () => {
        this.produtos = this.produtos.filter(x => x.id !== p.id);
      },
      error: () => {
        this.erro = 'Não foi possível excluir o produto.';
      }
    });
  }
}
