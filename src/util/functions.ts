import router from "@/router";

const generateCode = (length = 10) =>
    Array.from({ length }, () =>
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 36)]
    ).join("");

export function createList() {
    const code = generateCode();

    // TODO: add new list to supabase

    router.push(`/${code}`);
}
