export interface ListItem {
  name: string;
  extra?: string;
}

export interface ListData {
  name: string;
  list: ListItem[];
};
