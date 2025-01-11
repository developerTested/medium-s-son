import { FaEdit, FaTrash } from "react-icons/fa";

export default function Dashboard() {
  const posts = [
    {
      title: "How to Learn React",
      author: "John Doe",
      date: "Dec 21, 2024",
      category: "Programming",
    },
    {
      title: "Tailwind CSS: A Game Changer",
      author: "Jane Smith",
      date: "Dec 20, 2024",
      category: "CSS",
    },
    {
      title: "Building Scalable Apps with Node.js",
      author: "Mike Johnson",
      date: "Dec 18, 2024",
      category: "Backend",
    },
  ];

  // Handler functions for Edit and Delete
  const handleEdit = (postTitle: string) => {
    alert(`Edit post: ${postTitle}`);
  };

  const handleDelete = (postTitle: string) => {
    alert(`Delete post: ${postTitle}`);
  };

  return (
    <div className="grow h-full p-6">
      {/* Dashboard Content */}
      <div className="block mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Users</h3>
            <p className="text-xl text-gray-900">1,230</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Sales</h3>
            <p className="text-xl text-gray-900">5,400</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Revenue</h3>
            <p className="text-xl text-gray-900">$15,000</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <PostCard
            key={index}
            title={post.title}
            author={post.author}
            date={post.date}
            category={post.category}
            onEdit={() => handleEdit(post.title)}
            onDelete={() => handleDelete(post.title)}
          />
        ))}
      </div>
    </div>
  );
}

type postCards = {
title: string,
author: string,
date: string,
category: string,
onEdit: () => void,
onDelete: () => void,
}

const PostCard = ({ title, author, date, category, onEdit, onDelete }: postCards) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
    {/* Post Title */}
    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>

    {/* Post Meta */}
    <div className="flex items-center justify-between mt-1 text-sm text-gray-500">
      <span>By {author}</span>
      <span>{date}</span>
    </div>

    {/* Post Category */}
    <div className="mt-1">
      <span className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded-full">{category}</span>
    </div>

    {/* Actions */}
    <div className="mt-3 flex justify-between items-center">
      <button
        onClick={onEdit}
        className="p-2 text-blue-500 hover:text-blue-600 transition duration-200"
      >
        <FaEdit size={18} />
      </button>
      <button
        onClick={onDelete}
        className="p-2 text-red-500 hover:text-red-600 transition duration-200"
      >
        <FaTrash size={18} />
      </button>
    </div>
  </div>
  );
};
