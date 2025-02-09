"use server";

import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export const getFilteredPosts = async (filters: {
    tag?: string;
    date?: string;
}) => {
    const databaseId = process.env.NOTION_DATABASE_ID!;

    let filterConditions: any[] = [];

    // タグでフィルタリング
    if (filters.tag) {
        filterConditions.push({
            property: "Tags",
            multi_select: { contains: filters.tag },
        });
    }

    // 日付でフィルタリング
    if (filters.date) {
        filterConditions.push({
            property: "Date",
            date: { equals: filters.date },
        });
    }

    const queryOptions: any = { database_id: databaseId };
    if (filterConditions.length > 0) {
        queryOptions.filter =
            filterConditions.length > 1
                ? { and: filterConditions }
                : filterConditions[0];
    }

    const response = await notion.databases.query(queryOptions);

    return response.results.map((page: any) => {
        if (!("properties" in page)) {
            return {
                id: page.id,
                title: "No Title",
                tags: [],
                date: "No Date",
                description: "",
            };
        }
        const title = page.properties.Title?.title[0]?.plain_text || "No Title";
        const tags =
            page.properties.Tags?.multi_select?.map((tag: any) => tag.name) ||
            [];
        const date = page.properties.Date?.date?.start || "No Date";
        const description =
            page.properties.Description?.rich_text[0]?.plain_text || "";

        return { id: page.id, title, tags, date, description };
    });
};
