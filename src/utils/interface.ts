export interface IUser {
  email: string;
  password: string;
}
export interface ICategory {
  id: string;
  name: string;
}
export interface IProduct {
  id: string;
  categoryname: string; 
  name: string;
  price: number;
  photo: string;
}
export interface IClient {
  id: string;
  name: string;
  photo: string;
}
export interface IStock {
  id: string;
  product_id: number;
  product_name: string;
  amount: number;
  hasStock: boolean;
}
export interface IOrder {
  id: string;
  client_name: string;
  product_name: string;
  amount: number;
  price: number;
  obs: string;
}
export interface ITransaction {
  id: number;
  modality: string;
  kind: string;
  place: string;
  product_name: string;
  client_name: string;
  amount: number;
  price: number;
  datetransaction: string;
  ispaid: boolean;
}
export interface IIngredient {
  name: string;
  amount: string;
  conditions: string;
}
export interface IRecipe {
  id: string;
  nameproduct: string;
  ingredients: IIngredient[];
  preparation: string;
  cooking: string;
}
export interface IResumeTransaction {
  title: string;
  price: string;
  period: string;
  icon?: string;
}
export interface IChartData {
  name: string;
  compras: number;
  vendas: number;
  saldo: number;
}
