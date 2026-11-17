import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface LinhaCategoria {
  nome: string;
  quantidade: number;
  valor: number;
}

@Component({
  selector: 'app-relatorio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.css']
})
export class RelatorioComponent implements OnInit {
  private http = inject(HttpClient);

  produtos: any[] = [];
  pedidos: any[] = [];
  usuarios: any[] = [];
  porCategoria: LinhaCategoria[] = [];

  totalProdutos = 0;
  totalCategorias = 0;
  valorCatalogo = 0;
  totalPedidos = 0;
  receitaPedidos = 0;
  totalUsuarios = 0;

  carregando = true;
  erro = '';
  ok = '';

  ngOnInit(): void {
    this.carregar();
  }

  private seguro<T>(url: string) {
    return this.http.get<T[]>(url).pipe(catchError(() => of([] as T[])));
  }

  carregar(): void {
    this.carregando = true;
    this.erro = '';
    this.ok = '';

    forkJoin({
      produtos: this.seguro<any>('/produtos'),
      categorias: this.seguro<any>('/categorias'),
      pedidos: this.seguro<any>('/pedidos'),
      usuarios: this.seguro<any>('/usuarios')
    }).subscribe({
      next: r => {
        this.produtos = r.produtos ?? [];
        this.pedidos = r.pedidos ?? [];
        this.usuarios = r.usuarios ?? [];

        this.calcular(r.categorias ?? []);
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.erro = 'Não foi possível carregar os dados do relatório.';
      }
    });
  }

  private calcular(cats: any[]): void {
    const nomes: string[] = cats.map(c => c.nome);

    const usadas: string[] = [];

    this.produtos.forEach(p => {
      if (p.categoria && usadas.indexOf(p.categoria) === -1) {
        usadas.push(p.categoria);
      }
    });

    const lista = nomes.length > 0 ? nomes : usadas;

    this.porCategoria = lista.map(nome => {
      const itens = this.produtos.filter(p => p.categoria === nome);

      return {
        nome,
        quantidade: itens.length,
        valor: itens.reduce((soma, p) => soma + Number(p.preco || 0) * Number(p.estoque || 0), 0)
      };
    });

    this.totalProdutos = this.produtos.length;
    this.totalCategorias = this.porCategoria.length;
    this.valorCatalogo = this.porCategoria.reduce((soma, c) => soma + c.valor, 0);

    this.totalPedidos = this.pedidos.length;
    this.receitaPedidos = this.pedidos.reduce(
      (soma, p) => soma + Number(p.total || 0),
      0
    );

    this.totalUsuarios = this.usuarios.length;
  }

  atualizar(): void {
    this.carregar();
    this.ok = 'Dados atualizados.';
  }

  resetar(): void {
    const confirmar = confirm(
      'Recarregar todos os dados do servidor? As alterações não salvas serão descartadas.'
    );

    if (!confirmar) return;

    this.carregar();
    this.ok = 'Dados recarregados do servidor.';
  }
}
