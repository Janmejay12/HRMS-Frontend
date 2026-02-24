import React, { useState } from "react";
import { postApis, type PostRequest } from "../../apis/PostApis";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFile = e.target.files[0];

    // validation
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File must be less than 5MB");
      return;
    }

    setFile(selectedFile);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file");
      return;
    }

    const request: PostRequest = {
      title,
      content,
    };

    try {
      setLoading(true);
      setError("");

      await postApis.createPost(request, file);

      setSuccess("Post created successfully");

      setTitle("");
      setContent("");
      setFile(null);
    } catch (err: any) {
      setError(err.response?.data || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Create Post</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-3 rounded">{error}</div>
      )}

      {success && (
        <div className="bg-green-100 text-green-700 p-2 mb-3 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block font-medium">Title</label>

          <input
            type="text"
            className="w-full border rounded p-2 focus:ring focus:ring-blue-200"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="block font-medium">Content</label>

          <textarea
            className="w-full border rounded p-2 focus:ring focus:ring-blue-200"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        {/* File */}
        <div>
          <label className="block font-medium">Upload Image</label>

          <input
            type="file"
            accept="image/png,image/jpeg"
            onChange={handleFileChange}
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-gray py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
