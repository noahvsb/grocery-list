export interface ListItem {
  id: number,
  name: string;
  extra?: string;
}

export interface GroceryList {
  code: string;
  name: string;
  list: ListItem[];
};
