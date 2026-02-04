import router from "@/router";
import supabase from "./supabase_client";

import type { ListItem, GroceryList } from "@/util/types";

function showError(msg: string): void {
    console.error("Error:", msg);
}

export async function createList(name: string): Promise<void> {
    const { data: code, error } = await supabase.rpc('create_grocery_list', { list_name: name });

    if (error)
        showError("create list: " + error.message);
    else
        router.push({ path: "/", query: { code } });
}

export async function deleteList(code: string): Promise<void> {
    const { error } = await supabase.rpc("delete_grocery_list", { p_code: code });

    if (error)
        showError("delete list: " + error.message);
    else
        router.push("/");
}

function parseList(data: any): GroceryList {
    const row = Array.isArray(data) ? data[0] : data;

    const items = Array.isArray(row.list) ? row.list : [];

    return {
        code: row.code,
        name: row.name,
        list: items
            .filter((item: any) => item && item.id != null)
            .map((item: any) => ({
                id: item.id,
                name: item.name,
                extra: item.extra ?? undefined,
            })),
    };
}

export async function getList(code: string): Promise<GroceryList | null> {
    const { data, error } = await supabase.rpc('get_grocery_list', { p_code: code });
    
    if (error) {
        showError("get list: " + error.message);
        return null;
    } else {
        if (!data || (Array.isArray(data) && data.length === 0)) return null;
        return parseList(data);
    }
}

export async function addItem(grocery: GroceryList, itemName: string, itemExtra?: string): Promise<void> {
    const { data: id, error } = await supabase.rpc('add_list_item', { grocery_code: grocery.code, item_name: itemName, item_extra: itemExtra });

    if (error)
        showError("add item: " + error.message)
    else
        grocery.list.push({ id, name: itemName, extra: itemExtra});
}

export async function removeItem(grocery: GroceryList, itemId: number): Promise<void> {
    const { error } = await supabase.rpc('remove_list_item', { item_id: itemId });

    if (error)
        showError("remove item: " + error.message);
    else {
        grocery.list = grocery.list.filter(item => item.id !== itemId);
    }
}
