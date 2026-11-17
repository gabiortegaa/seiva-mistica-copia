import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ProdutoService } from '../../services/produto.service';

interface CardCategoria {
  nome: string;
  imagem: string;
  quantidade: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private produtoService = inject(ProdutoService);

  categorias: CardCategoria[] = [];
  carregando = true;
  aviso = '';

  private nomesCategorias: string[] = [];

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.aviso = '';

    this.produtoService.listarCategorias().subscribe({
      next: cats => {
        this.nomesCategorias = cats.map(c => c.nome);
        this.buscarProdutos();
      },
      error: () => {
        this.nomesCategorias = [];
        this.buscarProdutos();
      }
    });
  }

  private buscarProdutos(): void {
    this.produtoService.listar().subscribe({
      next: produtos => {
        this.categorias = this.nomesCategorias.map(nome => ({
          nome,
          imagem: this.imagemCategoria(nome),
          quantidade: produtos.filter(p => p.categoria === nome).length
        }));

        this.carregando = false;
      },
      error: (err: HttpErrorResponse) => {
        this.categorias = [];
        this.carregando = false;
        this.aviso =
          err.status === 0
            ? 'Servidor fora do ar. Inicie o json-server na porta 3000.'
            : 'Não foi possível carregar as categorias.';
      }
    });
  }

  imagemCategoria(nome: string): string {
    const mapa: Record<string, string> = {
      'Cristais': 'assets/cristais.png',
      'Tarô e Oráculos': 'assets/taro.png',
      'Ervas Aromáticas e Banhos': 'assets/ervas.png'
    };
    return mapa[nome] || 'assets/cristais.png';
  }

  semImagem(evento: Event): void {
    (evento.target as HTMLImageElement).src = 'assets/cristais.png';
  }
}
