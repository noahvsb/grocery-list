import router from "@/router";

import type { ListItem, ListData } from "@/util/types";

const generateCode = (length = 10) =>
    Array.from({ length }, () =>
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 36)]
    ).join("");

export function createList(): void {
    const code = generateCode(); // TODO: make this the id that supabase generates

    // TODO: add new list to supabase

    router.push(`/${code}`);
}

export function fetchData(code: string): ListData {
    // TODO: fetch from supabase
    return {
        name: "Carrefour 4/02/26",
        list: [
            { name: "apple", extra: "2 kg" },
            { name: "banana", extra: "1 kg" },
            { name: "bread", extra: "white" },
        ] as ListItem[],
    };
}

export function addItem(code: string, list: ListItem[], item: ListItem): void {
    list.push(item);

    // TODO: update supabase
}

export function removeItem(code: string, list: ListItem[], index: number): void {
    list.splice(index, 1);

    // TODO: update supabase
}
