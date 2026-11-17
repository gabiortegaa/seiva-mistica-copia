import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

interface Pedido {
  id?: number;
  codigo: string;
  cliente: string;
  itens: any;
  total: number;
  data: string;
  status: string;
}

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  pedidos: Pedido[] = [];
  carregando = true;
  erro = '';

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.erro = '';

    this.http.get<Pedido[]>('/pedidos').subscribe({
      next: lista => {
        const usuario = this.auth.atual;

        const meus = usuario && usuario.nome
          ? lista.filter(
              p => (p.cliente || '').trim().toLowerCase() === usuario.nome.trim().toLowerCase()
            )
          : lista;

        this.pedidos = meus.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
        this.carregando = false;
      },
      error: () => {
        this.pedidos = [];
        this.carregando = false;
        this.erro = 'Não foi possível carregar seus pedidos.';
      }
    });
  }

  get totalPedidos(): number {
    return this.pedidos.length;
  }

  get valorTotal(): number {
    return this.pedidos.reduce((soma, p) => soma + Number(p.total || 0), 0);
  }

  descricaoItens(p: Pedido): string {
    if (Array.isArray(p.itens)) {
      return p.itens
        .map((i: any) => {
          const qtd = i.quantidade ?? 1;
          const nome = i.nome ?? i.produto?.nome ?? '';
          return `${qtd}x ${nome}`.trim();
        })
        .join(', ');
    }

    return p.itens ? String(p.itens) : '—';
  }

  recarregar(): void {
    this.carregar();
  }
}
