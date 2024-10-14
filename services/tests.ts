/* /services/tests.ts */

"use server";

import { sql } from "@vercel/postgres";

export interface Posts {
    id: number;
    title: string;
    content: string;
    author: string;
}

export async function getPostsData(): Promise<Posts[]> {
    try {
        const { rows }: { rows: Posts[] } = await sql`SELECT id, title, content, author FROM tests;`;
        return rows;
    } catch {
        throw new Error("Failed to fetch posts data");
    }
}
