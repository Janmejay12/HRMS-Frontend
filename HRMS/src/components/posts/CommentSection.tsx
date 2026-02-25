import React, { useState } from "react";
import { postApis, type CommentResponse, type PostResponse } from "../../apis/PostApis";
import CommentItem from "./CommentItem";
interface Props {
  post: PostResponse;
}
const CommentSection: React.FC<Props> = ({ post }) => {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const fetchComments = async () => {
    try {
      const data = await postApis.getCommentsByPostId(post.postId);

      setComments(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggle = () => {
    if (!showComments) {
      fetchComments();
    }

    setShowComments(!showComments);
  };
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setLoading(true);

      const created = await postApis.createComment(post.postId, newComment);

      setComments((prev) => [...prev, created]);

      setNewComment("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3">
      {/* Toggle */}
      <button
        onClick={handleToggle}
        className="text-sm text-gray-600 hover:text-blue-600 mb-2"
      >
        {showComments ? "Hide comments" : `View comments (${post.comments.length})`}
      </button>

      {showComments && (
        <div className="border-t pt-2">
          {/* Add comment */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
            />

            <button
              onClick={handleAddComment}
              disabled={loading}
              className="bg-blue-600 text-gray px-4 py-2 rounded-full text-sm hover:bg-blue-700"
            >
              Post
            </button>
          </div>

          {/* Comments list */}
          <div className="space-y-1">
            {comments.map((comment) => (
              <CommentItem key={comment.commentId} comment={comment} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
