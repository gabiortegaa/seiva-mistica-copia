import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CarrinhoService } from '../../services/carrinho.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private carrinhoService = inject(CarrinhoService);
  private router = inject(Router);

  menuAberto = false;
  auth = this.authService;
  qtd$ = this.carrinhoService.qtd$;

  sair(): void {
    this.menuAberto = false;
    this.authService.sair();
    this.router.navigate(['/home']);
  }
}
