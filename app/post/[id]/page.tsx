import { notFound } from "next/navigation";
import { getNotionBlogPosts } from "@/lib/notionAPI";

export default async function Post({ params }: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    const posts = await getNotionBlogPosts();
    const post = posts.find((p) => p.id === id);

    if (!post) return notFound();

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <p className="text-gray-500 mb-4">📅 {post.date}</p>
            <p className="text-gray-700">{post.description}</p>

            {post.tags.length > 0 && (
                <div className="mt-4">
                    {post.tags.map((tag) => (
                        <span key={tag} className="mr-2 px-2 py-1 bg-blue-100 text-blue-600 rounded">
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            <a href="/" className="mt-6 inline-block text-blue-600 underline">← 戻る</a>
        </div>
    );
}
