import React from "react";
import type { CommentResponse } from "../../apis/PostApis";
interface Props {
  comment: CommentResponse;
}

const CommentItem: React.FC<Props> = ({ comment }) => {
  return (
    <div className="flex gap-3 py-2">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center text-sm font-semibold">
        {comment.commentedBy[0]}
      </div>

      {/* Comment bubble */}
      <div className="bg-gray-100 rounded-lg px-3 py-2 flex">
        <div className="text-sm font-semibold text-gray-800">
          {comment.commentedBy}
        </div>

        <div className="text-sm text-gray-700">:  {comment.commentText}</div>
      </div>
    </div>
  );
};

export default CommentItem;
