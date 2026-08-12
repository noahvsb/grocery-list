export interface ListItem {
  id: number,
  name: string;
  amount: number;
  strikethrough?: boolean;
}

export interface GroceryList {
  code: string;
  name: string;
  list: ListItem[];
};
