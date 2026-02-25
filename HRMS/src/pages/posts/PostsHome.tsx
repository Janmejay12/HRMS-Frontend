import React, { useEffect, useState } from "react";
import { postApis, type PostResponse } from "../../apis/PostApis";
import PostCard from "../../components/posts/PostCard";

const PostsHome = () => {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    try {
      setLoading(true);

      const data = await postApis.getAllPosts();

      setPosts(data);
      console.log(data);
    } catch (err: any) {
      setError(err.response?.data || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-lg">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-xl mx-auto space-y-5">
        {posts.map((post) => (
          <PostCard key={post.postId} post={post} />
        ))}
      </div>
    </div>
  );
};

export default PostsHome;
