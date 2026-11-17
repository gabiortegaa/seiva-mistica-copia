export interface Usuario {
  id?: number | string;
  nome: string;
  cpf: string;
  email: string;
  senha?: string;
  preferencias?: string[];
}
