import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { SobreComponent } from './pages/sobre/sobre.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { CategoriaComponent } from './pages/categoria/categoria.component';
import { CarrinhoComponent } from './pages/carrinho/carrinho.component';
import { PedidosComponent } from './pages/pedidos/pedidos.component';
import { LoginComponent } from './pages/login/login.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminEditarComponent } from './pages/admin-editar/admin-editar.component';
import { RelatorioComponent } from './pages/relatorio/relatorio.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'sobre', component: SobreComponent },

  { path: 'catalogo', component: CatalogoComponent },
  { path: 'categoria/:nome', component: CategoriaComponent },

  { path: 'carrinho', component: CarrinhoComponent },
  { path: 'pedidos', component: PedidosComponent },

  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },

  { path: 'admin', component: AdminComponent },
  { path: 'admin-editar', component: AdminEditarComponent },
  { path: 'relatorio', component: RelatorioComponent },

  { path: '**', redirectTo: 'home' }
];
