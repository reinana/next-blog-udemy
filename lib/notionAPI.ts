import { Client } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import sanitizeHtml from "sanitize-html";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
/** XSS 対策のためのサニタイズ関数 */
const cleanText = (text: string) =>
    sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} });

/** Notion のページ一覧を取得 */
export const getNotionBlogPosts = async () => {
    const databaseId = process.env.NOTION_DATABASE_ID;

    const response = await notion.databases.query({
        database_id: databaseId!,
        sorts: [{ property: "Date", direction: "descending" }],
    });

    return response.results
        .filter((page): page is PageObjectResponse => "properties" in page) // 型ガード
        .map((page) => {
            const titleProperty = page.properties.Title;
            let title = "No Title";

            if (
                titleProperty?.type === "title" &&
                titleProperty.title.length > 0
            ) {
                title = titleProperty.title[0].plain_text;
            }

            const tagsProperty = page.properties.Tags;
            let tags: string[] = [];

            if (
                tagsProperty?.type === "multi_select" &&
                tagsProperty.multi_select.length > 0
            ) {
                tags = tagsProperty.multi_select.map((tag) => tag.name);
            }

            let description = "";
            const descriptionProperty = page.properties.Description;

            if (
                descriptionProperty?.type === "rich_text" &&
                descriptionProperty.rich_text.length > 0
            ) {
                description = cleanText(
                    descriptionProperty.rich_text[0].plain_text
                );
            }

            const dateProperty = page.properties.Date;
            let date = "No Date";

            if (dateProperty?.type === "date" && dateProperty.date?.start) {
                date = dateProperty.date.start;
            }

            return {
                id: page.id,
                title,
                tags,
                description,
                date,
            };
        });
};
