import { PostType } from "@/types";
import { formatDate } from "@/utilities/helper";
import { Link } from "react-router-dom";
import Avatar from "../Avatar";

type PostItemCardProps = {
  post?: PostType
}

export default function PostItemCard({ post }: PostItemCardProps) {

  if (!post?.id) {
    return <article className="p-2 animate-pulse bg-white rounded">
      <div className="flex items-center gap-2 mb-2">
        <Avatar
          className="w-8 h-8 rounded-full"
        />
        <div className="grow flex items-center gap-4">
          <div className="bg-slate-200 w-60 h-8 display-name"></div>
          <div className="bg-slate-200 w-60 h-8 posted-on"></div>
        </div>
      </div>
      <div className="bg-slate-200 mb-2"></div>
      <p className="bg-slate-200 w-full h-14 mb-4 line-clamp-2"></p>
    </article>
  }

  return (
    <article className="flex gap-6 p-2 cursor-pointer bg-white hover:bg-slate-100 rounded shadow">
      <Link to={`/${post.author.user_name}/${post.slug}`} className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Avatar
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.author.display_name}`}
            alt={post.author.display_name}
            className="w-6 h-6 rounded-full"
          />
          <div className="flex items-center text-sm gap-4">
            <span className="font-semibold display-name">{post.author.display_name}</span>
            <span className="w-1 h-1 rounded-full bg-gray-500"></span>
            <span className="text-gray-500 posted-on">{formatDate(post.createdAt)}</span>
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2 font-serif post-title">{post.title}</h2>
        <p className="text-gray-600 mb-4 line-clamp-2 post-content">{post.content}</p>
      </Link>
      {post.featuredImage && (
        <div className="w-48 h-32 hidden md:block">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </article>
  );
}

