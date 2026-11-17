export interface ItemPedido {
  produtoId: number;
  nome: string;
  quantidade: number;
  preco: number;
}

export interface Pedido {
  id?: number;
  codigo: string;
  cliente: string;
  itens: ItemPedido[];
  total: number;
  data: string;
  status: string;
}
