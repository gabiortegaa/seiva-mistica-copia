import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProdutoService } from '../../services/produto.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { Produto } from '../../produto.model';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {
  private produtoService = inject(ProdutoService);
  private carrinho = inject(CarrinhoService);
  private rota = inject(ActivatedRoute);

  nome = '';
  produtos: Produto[] = [];
  carregando = true;
  aviso = '';

  ngOnInit(): void {
    this.rota.paramMap.subscribe(params => {
      this.nome = params.get('nome') ?? '';
      this.buscar();
    });
  }

  private buscar(): void {
    this.carregando = true;
    this.produtoService.listar().subscribe({
      next: produtos => {
        this.produtos = produtos.filter(p => p.categoria === this.nome);
        this.carregando = false;
      },
      error: () => {
        this.produtos = [];
        this.carregando = false;
        this.aviso = 'Não foi possível carregar os produtos.';
      }
    });
  }

  adicionar(produto: Produto): void {
    this.carrinho.adicionar(produto);
  }

  semImagem(evento: Event): void {
    (evento.target as HTMLImageElement).src = 'assets/quartzo.svg';
  }
}
