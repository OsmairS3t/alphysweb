export interface IUser {
  id: number;
  email: string;
  name: string;
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
  product_name: string;
  amount: number;
  hasStock: boolean;
}
export interface IBuy {
  id: string;
  kind: string;
  name: string;
  place: string;
  amount: number;
  price: number;
  datebuy: string;
}
export interface ISale {
  id: string;
  client_name: string;
  product_name: string;
  amount: number;
  price: number;
  isPaid: boolean;
  datesale: string;
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

//===TABLES===/
// buys
// categories
// clients
// ingredients
// ingredients_recipe
// orders
// products
// recipes
// sales
// stocks
// users