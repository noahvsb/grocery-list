export interface ListItem {
  id: number,
  name: string;
  amount?: number;
}

export interface GroceryList {
  code: string;
  name: string;
  list: ListItem[];
};
