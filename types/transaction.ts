export interface Transaction {
  type: string;
  category: { name: string };
  date: string;
  amount: number;
}
