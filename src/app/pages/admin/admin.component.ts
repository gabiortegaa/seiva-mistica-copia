import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Produto {
  id?: number;
  nome: string;
  categoria: string;
  preco: number;
  imagem: string;
  descricao: string;
  estoque: number;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  private http = inject(HttpClient);
  private rota = inject(ActivatedRoute);
  private router = inject(Router);

  categorias: string[] = [];
  erro = '';
  ok = '';
  editandoId: number | null = null;

  novo: Produto = this.vazio();

  ngOnInit(): void {
    this.carregarCategorias();

    this.rota.queryParamMap.subscribe(params => {
      const id = params.get('editar');

      if (id) {
        this.editandoId = Number(id);
        this.carregarProduto(this.editandoId);
      } else {
        this.editandoId = null;
        this.novo = this.vazio();
      }
    });
  }

  private vazio(): Produto {
    return {
      nome: '',
      categoria: '',
      preco: 0,
      imagem: '',
      descricao: '',
      estoque: 0
    };
  }

  private carregarCategorias(): void {
    this.http.get<any[]>('/categorias').subscribe({
      next: cats => {
        this.categorias = cats.map(c => c.nome);

        if (!this.novo.categoria && this.categorias.length > 0) {
          this.novo.categoria = this.categorias[0];
        }
      },
      error: () => {
        this.categorias = [];
      }
    });
  }

  private carregarProduto(id: number): void {
    this.http.get<Produto>(`/produtos/${id}`).subscribe({
      next: p => {
        this.novo = { ...p };
        this.ok = `Editando: ${p.nome}`;
      },
      error: () => {
        this.erro = 'Produto não encontrado.';
        this.editandoId = null;
        this.novo = this.vazio();
      }
    });
  }

  salvar(): void {
    this.erro = '';
    this.ok = '';

    if (!this.novo.nome || !this.novo.nome.trim()) {
      this.erro = 'Informe o nome do produto.';
      return;
    }

    if (!this.novo.categoria) {
      this.erro = 'Selecione uma categoria.';
      return;
    }

    if (!this.novo.preco || Number(this.novo.preco) <= 0) {
      this.erro = 'O preço deve ser maior que zero.';
      return;
    }

    if (Number(this.novo.estoque) < 0) {
      this.erro = 'O estoque não pode ser negativo.';
      return;
    }

    const corpo: Produto = {
      nome: this.novo.nome.trim(),
      categoria: this.novo.categoria,
      preco: Number(this.novo.preco),
      imagem: (this.novo.imagem || '').trim() || 'assets/cristais.png',
      descricao: (this.novo.descricao || '').trim(),
      estoque: Number(this.novo.estoque)
    };

    if (this.editandoId !== null) {
      this.http.put<Produto>(`/produtos/${this.editandoId}`, { ...corpo, id: this.editandoId })
        .subscribe({
          next: () => {
            this.ok = 'Produto atualizado com sucesso.';
            this.router.navigate(['/admin-editar']);
          },
          error: () => {
            this.erro = 'Não foi possível atualizar o produto.';
          }
        });
      return;
    }

    this.http.post<Produto>('/produtos', corpo).subscribe({
      next: () => {
        this.ok = 'Produto adicionado com sucesso.';
        this.novo = this.vazio();

        if (this.categorias.length > 0) {
          this.novo.categoria = this.categorias[0];
        }
      },
      error: () => {
        this.erro = 'Não foi possível adicionar o produto.';
      }
    });
  }
}
