# Seiva Mística

> Encontre sua essência. Cultive boas energias.

Site de e-commerce de produtos esotéricos naturais — cristais, tarô e oráculos, ervas aromáticas e banhos. Desenvolvido como projeto integrador do curso, com front-end em Angular e uma API simulada com `json-server`.

---

## Sobre o projeto

A Seiva Mística nasceu da vontade de trazer mais significado aos pequenos momentos do dia. O site reúne produtos naturais selecionados para quem deseja criar seus próprios rituais de autocuidado, com uma interface calma, editorial e inspirada na natureza.

O projeto cobre o fluxo completo de uma loja: navegação por categorias, catálogo com filtros, carrinho com controle de quantidade, finalização de pedido, histórico do cliente e uma área administrativa com relatórios de estoque e vendas.

---

## Funcionalidades

**Área do visitante**

- Home com hero e navegação por categorias
- Catálogo completo com filtro por categoria
- Página dedicada por categoria
- Carrinho com adicionar, aumentar, diminuir, remover e limpar
- Finalização de pedido com geração de código único
- Persistência do carrinho no navegador entre sessões

**Área do cliente**

- Cadastro com validação de CPF
- Login e logout
- Histórico de pedidos filtrado por usuário
- Cabeçalho que reflete o estado de autenticação

**Área administrativa** (visível apenas para administradores)

- Cadastro de novos produtos
- Edição e exclusão de produtos
- Relatório com KPIs: total de produtos, categorias, valor em catálogo, pedidos, receita e usuários
- Tabelas detalhadas de produtos, pedidos e usuários

---

## Tecnologias

| Camada | Ferramenta |
|---|---|
| Framework | Angular 17+ (componentes standalone) |
| Linguagem | TypeScript |
| Estilo | CSS puro com design system em variáveis |
| Estado | RxJS (`BehaviorSubject`) |
| HTTP | `HttpClient` com proxy para a API |
| API simulada | `json-server` |
| Tipografia | Cormorant Garamond e Jost (Google Fonts) |

---

## Pré-requisitos

- Node.js 18 ou superior
- npm 9 ou superior
- Angular CLI (`npm install -g @angular/cli`)

Confira as versões:

```bash
node -v
npm -v
ng version
