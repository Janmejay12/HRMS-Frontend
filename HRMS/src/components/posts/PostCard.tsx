import React, { useState } from "react";
import { postApis, type PostResponse } from "../../apis/PostApis";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/16/solid";
import CommentSection from "./CommentSection";

interface Props {
  post: PostResponse;
}
const PostCard: React.FC<Props> = ({ post }) => {
  const [postData, setPostData] = useState<PostResponse>(post);

  const [liked, setLiked] = useState(false);

  const [loading, setLoading] = useState(false);
  const handleLike = async () => {
    if (loading) return;

    setLiked(!liked);

    try {
      setLoading(true);

      await postApis.likePost(postData.postId);

      const updatedPost = await postApis.getPostsById(postData.postId);

      setPostData(updatedPost);
    } catch (error) {
      console.error("Like failed:", error);
      setLiked(!liked);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition p-5">
      {/* Author Section */}
      <div className="flex items-center gap-3 mb-3">
        {post.systemPost ? (
          <>
            <div className="w-11 h-11 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
              <strong>R</strong>
            </div>

            <div>
              <div className="font-semibold text-gray-800">System-Post</div>

              <div className="text-xs text-gray-500">
                Automated notification
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-11 h-11 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
              {post.authorName?.[0]}
            </div>

            <div>
              <div className="font-semibold text-gray-800">
                {post.authorName}
              </div>

              <div className="text-xs text-gray-500">Posted recently</div>
            </div>
          </>
        )}
      </div>

      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-900 mb-1">{post.title}</h2>

      {/* Content */}
      <p className="text-gray-700 mb-3 whitespace-pre-line">{post.content}</p>

      {/* Media */}
      {post.postUrlPath && (
        <div className="rounded-lg overflow-hidden border border-gray-200 mb-3">
          <img
            src={post.postUrlPath}
            alt="post"
            className="w-full max-h-[500px] object-cover hover:scale-[1.01] transition"
          />
        </div>
      )}

      {/* Engagement Stats */}
      <div className="flex justify-between text-sm text-gray-500 border-b pb-2 mb-2">
        <span>{postData.likesCount} likes</span>

        <span>{postData.comments?.length} comments</span>
      </div>

      {/* Actions */}
      <div className="flex justify-around text-gray-600">
        <button
          onClick={handleLike}
          disabled={loading}
          className="flex items-center gap-2 hover:text-blue-600 transition"
        >
          {liked ? (
            <HeartSolid className="w-5 h-5 text-red-500" />
          ) : (
            <HeartOutline className="w-5 h-5" />
          )}
          Like
        </button>

        <button className="flex items-center gap-2 hover:text-blue-600 transition">
          <ChatBubbleOvalLeftIcon className="w-5 h-5" />
          Comment
        </button>
      </div>

      <CommentSection post={post} />
    </div>
  );
};

export default PostCard;
