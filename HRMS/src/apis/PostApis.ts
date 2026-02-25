import { api } from "./axios";

export interface PostRequest {
  title: string;
  content: string;
}

export interface CommentResponse {
  commentId: number;
  commentedBy: string;
  commentedById: number;
  commentText: string;
  postId: number;
}

export interface PostResponse {
  postId: number;
  likesCount: number;
  title: string;
  authorName: string;
  content: string;
  authorId: number;
  systemPost: boolean;
  postUrlPath: string;
  comments: CommentResponse[];
}

export const postApis = {
  createPost: async (
    request: PostRequest,
    file: File,
  ): Promise<PostResponse> => {
    const formData = new FormData();
    formData.append(
      "data",
      new Blob([JSON.stringify(request)], {
        type: "application/json",
      }),
    );
    formData.append("file", file);

    const response = await api.post<PostResponse>("/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
  getAllPosts: async (): Promise<PostResponse[]> => {
    const response = await api.get<PostResponse[]>("/posts");
    return response.data;
  },

  // Get My Posts
  getMyPosts: async (): Promise<PostResponse[]> => {
    const response = await api.get<PostResponse[]>(`/posts/my-posts`);

    return response.data;
  },

  // Get Posts by EmployeeId
  getPostsByEmployeeId: async (employeeId: number): Promise<PostResponse[]> => {
    const response = await api.get<PostResponse[]>(
      `/posts/employees/${employeeId}`,
    );

    return response.data;
  },
  createComment: async (
    postId: number,
    commentText: string,
  ): Promise<CommentResponse> => {
    const response = await api.post<CommentResponse>(
      `/posts/${postId}/comments`,
      { commentText },
    );

    return response.data;
  },

  // Get Comments by PostId
  getCommentsByPostId: async (postId: number): Promise<CommentResponse[]> => {
    const response = await api.get<CommentResponse[]>(
      `/posts/${postId}/comments`,
    );

    return response.data;
  },
  getPostsById: async (postId: number): Promise<PostResponse> => {
    const response = await api.get<PostResponse>(`/posts/${postId}`);

    return response.data;
  },
  likePost: async (postId: number): Promise<string> => {
    const response = await api.put<string>(
      `/posts/${postId}/like`,
    );

    return response.data;
  },
};
