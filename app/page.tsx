"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getFilteredPosts } from "@/actions/getFilteredPosts";

export default function Home() {
    const [posts, setPosts] = useState<{ id: any; title: any; tags: any; date: any; description: any; }[]>([]);
    const [tag, setTag] = useState("");
    const [date, setDate] = useState("");

    // 初回ロード時にすべての投稿を取得
    useEffect(() => {
        const fetchAllPosts = async () => {
            const allPosts = await getFilteredPosts({});
            setPosts(allPosts);
        };
        fetchAllPosts();
    }, []);

    const handleSearch = async () => {
        const filteredPosts = await getFilteredPosts({ tag, date });
        setPosts(filteredPosts);
    };

    const handleClear = async () => {
        setTag("");
        setDate("");
        const allPosts = await getFilteredPosts({});
        setPosts(allPosts);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Notion Blog</h1>

            {/* 検索フォーム */}
            <div className="mb-4 p-4 border rounded">
                <input
                    type="text"
                    placeholder="タグを入力"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="border p-2 rounded mr-2"
                />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border p-2 rounded mr-2"
                />
                <button onClick={handleSearch} className="px-4 py-2 bg-blue-500 text-white rounded">
                    検索
                </button>
                <button onClick={handleClear} className="ml-2 px-4 py-2 bg-gray-400 text-white rounded">
                    クリア
                </button>
            </div>

            {/* 投稿リスト */}
            <ul>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <li key={post.id} className="mb-4 p-4 border rounded">
                            <Link href={`/post/${post.id}`} className="text-blue-600 underline text-lg">
                                {post.title}
                            </Link>
                            <p className="text-gray-500">📅 {post.date}</p>
                            <p className="text-gray-600">{post.description}</p>
                            {post.tags.length > 0 && (
                                <div className="mt-2">
                                    {post.tags.map((tag: string) => (
                                        <span key={tag} className="mr-2 px-2 py-1 bg-blue-100 text-blue-600 rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </li>
                    ))
                ) : (
                    <p className="text-gray-500">検索結果がありません。</p>
                )}
            </ul>
        </div>
    );
}
