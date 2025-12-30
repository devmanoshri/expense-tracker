import { TransactionType } from "./transaction.model";

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
}
