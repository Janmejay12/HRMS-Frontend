import React, { useEffect, useState } from "react";
import { adminApis, type EmployeeResponse } from "../../apis/AdminApis";
import { postApis, type PostResponse } from "../../apis/PostApis";
import PostCard from "../../components/posts/PostCard";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [employee, setEmployee] = useState<EmployeeResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await adminApis.getEmployeeById();
        setEmployee(data);
      } catch (err) {
        setError("Failed to load employee data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);

      const data = await postApis.getMyPosts();

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
  const handleClick = () => {
    navigate("/create-post");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 font-semibold">{error || "No data found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        {/* Header */}
        <div className="flex items-center gap-6 border-b pb-6">
          <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
            {employee.employeeName.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {employee.employeeName}
            </h1>
            <p className="text-gray-500">{employee.designation || "N/A"}</p>
            <p className="text-sm text-gray-400">@{employee.username}</p>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <ProfileItem label="Employee Code" value={employee.employeeId} />
          <ProfileItem label="Email" value={employee.email} />
          <ProfileItem
            label="Birth Date"
            value={new Date(employee.birthDate).toLocaleDateString()}
          />
          <ProfileItem
            label="Joining Date"
            value={new Date(employee.joiningDate).toLocaleDateString()}
          />
          <ProfileItem label="Department" value={employee.departmentName} />
          <ProfileItem label="Manager" value={employee.managerEmployeeName} />
        </div>
      </div>
      <div>
        <br />
        <br />
        <h1>Your Posts</h1>
        <button
          className="px-4 py-2 bg-gray-600 flex justify-end text-gray  rounded-md hover:bg-gray-700"
          onClick={handleClick}
        >
          Create Post
        </button>
        <br />
        <div className="max-w-xl mx-auto space-y-5">
          {posts.map((post) => (
            <PostCard key={post.postId} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

interface ProfileItemProps {
  label: string;
  value: string | number;
}

const ProfileItem: React.FC<ProfileItemProps> = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-lg font-semibold text-gray-800">{value}</p>
  </div>
);

export default Profile;
