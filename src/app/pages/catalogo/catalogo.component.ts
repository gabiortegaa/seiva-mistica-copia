import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProdutoService } from '../../services/produto.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { Produto } from '../../produto.model';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {
  private produtoService = inject(ProdutoService);
  private carrinho = inject(CarrinhoService);

  produtos: Produto[] = [];
  categorias: string[] = [];
  filtro = '';
  carregando = true;
  aviso = '';

  ngOnInit(): void {
    this.produtoService.listarCategorias().subscribe({
      next: cats => {
        this.categorias = cats.map(c => c.nome);
        this.buscarProdutos();
      },
      error: () => this.buscarProdutos()
    });
  }

  private buscarProdutos(): void {
    this.produtoService.listar().subscribe({
      next: produtos => {
        this.produtos = produtos;
        this.carregando = false;
      },
      error: () => {
        this.produtos = [];
        this.carregando = false;
        this.aviso = 'Não foi possível carregar os produtos.';
      }
    });
  }

  get produtosFiltrados(): Produto[] {
    if (!this.filtro) return this.produtos;
    return this.produtos.filter(p => p.categoria === this.filtro);
  }

  filtrar(categoria: string): void {
    this.filtro = this.filtro === categoria ? '' : categoria;
  }

  adicionar(produto: Produto): void {
    this.carrinho.adicionar(produto);
  }

  semImagem(evento: Event): void {
    (evento.target as HTMLImageElement).src = 'assets/quartzo.svg';
  }
}
